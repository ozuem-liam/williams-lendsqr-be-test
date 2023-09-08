import ApiError from '../../utils/ApiError';
import { Request } from 'express';
import httpStatus from 'http-status';
import { knex } from '../../database/knex';
import { UserResponse } from '../user/user.service';
import { SharedService } from '../shared/shared.service';

export class WalletService {
    sharedService = new SharedService();

    public async getWallet(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const account = await this.sharedService.getAUser(user.email);

            // get user's wallet
            const wallet = await this.sharedService.getAUsersWallet(account[0].user_id);

            const message = 'Wallet retrieved created';

            return { isSuccess: true, message, data: { wallet: wallet[0] } };
        } catch (e) {
            const message = 'Could not get wallet';
            return { isSuccess: false, message };
        }
    }

    public async fundWallet(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, account_number } = req.body;

            const account = await this.sharedService.getAUser(user.email);

            // ---------------------------------------------------------------------
            // Call a third party API like Paystack to confirm account and make real life funding
            // ---------------------------------------------------------------------

            // fund user's wallet
            const wallet = await knex('wallets')
                .where({ user_id: account[0].user_id, account_number: account_number })
                .increment({
                    balance: amount,
                    times: 1,
                })
                .select('id', 'account_number', 'balance', 'user_id');

            if (!wallet[0]) return { isSuccess: false, message: 'Unable to complete transaction' };

            const message = 'Wallet funded was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet[0] } };
        } catch (e) {
            const message = 'Could not fund wallet';
            return { isSuccess: false, message };
        }
    }

    public async withdrawFunds(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, account_number, recieving_bank_account_number, recieving_bank_code } = req.body;

            const account = await this.sharedService.getAUser(user.email);

            // withdraw from user's wallet
            let wallet = await this.sharedService.getAUsersWallet(account[0].user_id);

            if (!wallet[0]) return { isSuccess: false, message: 'Unable to complete transaction' };

            if (!this.hasEnoughBalance(wallet[0], amount)) {
                const message = 'Insufficient balance';
                return { isSuccess: false, message };
            }

            // Validate account to withdraw to
            if (recieving_bank_account_number !== '0123456789' && recieving_bank_code !== '001') {
                const message = 'Invalid account';
                return { isSuccess: false, message };
            }

            wallet = await knex('wallets')
                .where({ user_id: account[0].user_id, account_number: account_number })
                .decrement({
                    balance: amount,
                })
                .select('id', 'account_number', 'balance', 'user_id');

            // ---------------------------------------------------------------------
            // Call a third party API like Paystack to confirm account and make real life payment to bank account
            // ---------------------------------------------------------------------
            const message = 'Withdrawal was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet[0] } };
        } catch (e) {
            const message = 'Could not withdraw from account';
            return { isSuccess: false, message };
        }
    }

    public async transferFund(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, account_number } = req.body;

            const account = await this.sharedService.getAUser(user.email);

            // get user's wallet
            const wallet = await this.sharedService.getAUsersWallet(account[0].user_id);

            if (!this.hasEnoughBalance(wallet[0], amount)) {
                const message = 'Insufficient balance';
                return { isSuccess: false, message };
            }

            // get receiver info
            const { receiver } = await this.confirmUserWallet(account_number);
            if (!receiver) return { isSuccess: false, message: 'Unable to fetch user wallet' };

            const { userWallet, receiverWallet } = await this.fundReceiverWallet(
                wallet[0].user_id,
                receiver.wallet.user_id,
                amount,
            );
            if (!userWallet && !receiverWallet) return { isSuccess: false, message: 'Unable to complete transaction' };

            const message = 'Transfer was successful';
            return { isSuccess: true, message, data: { user: user, wallet: userWallet[0] } };
        } catch (e) {
            const message = 'Could not log into account';
            return { isSuccess: false, message };
        }
    }

    public async confirmUserWallet(
        account_number: string,
    ): Promise<{ isSuccess: boolean; message: string; receiver: any }> {
        // get user's wallet
        const nwallet = await knex('wallets')
            .where({ account_number: account_number })
            .select('id', 'account_number', 'balance', 'user_id');
        if (!nwallet) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Wallet not found');

        const recieverAccount = await knex('users')
            .where({ id: nwallet[0].user_id })
            .select('id', 'useer_id', 'first_name', 'last_name', 'email', 'phone_number');
        if (!recieverAccount) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Account not found');
        const receiver = {
            account: recieverAccount[0],
            wallet: nwallet[0],
        };
        return { isSuccess: true, message: 'Successfully confirmed', receiver };
    }

    private async fundReceiverWallet(
        sender_wallet_user_id: any,
        receiver_wallet_user_id: any,
        amount: number,
    ): Promise<{ userWallet: any; receiverWallet: any }> {
        const [userWallet, receiverWallet] = await Promise.all([
            // discount sender wallet
            await knex('wallets').where({ user_id: sender_wallet_user_id }).decrement({
                balance: amount,
            }),

            // credit receiver wallet
            await knex('wallets').where({ user_id: receiver_wallet_user_id }).increment({
                balance: amount,
                times: 1,
            }),
        ]);
        return { userWallet, receiverWallet };
    }

    private hasEnoughBalance(wallet: any, amount: number): boolean {
        if (wallet.balance > amount) return true;
        return false;
    }
}
