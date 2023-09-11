import ApiError from '../../utils/ApiError';
import { Request } from 'express';
import httpStatus from 'http-status';
import knexapp from '../../database/knex';
import { UserResponse } from '../user/user.service';
import { sharedService } from '../shared/shared.service';

class WalletService {
    public async getWallet(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const account = await sharedService.getAUser(user.email);

            // get user's wallet
            const wallet = await sharedService.getAUsersWallet(account[0].id);

            const message = 'Wallet retrieved created';

            return { isSuccess: true, message, data: { wallet: wallet[0] } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    public async fundWallet(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, account_number } = req.body;

            const account = await sharedService.getAUser(user.email);

            // ---------------------------------------------------------------------
            // Call a third party API like Paystack to confirm account and make real life funding
            // ---------------------------------------------------------------------

            // fund user's wallet
            const wallet = await knexapp('wallets')
                .where({ user_id: account[0].id, account_number: account_number })
                .increment({
                    balance: amount,
                });

            if (!wallet) return { isSuccess: false, message: 'Unable to complete transaction' };

            const walletn = await sharedService.getAUsersWallet(user.id);

            const message = 'Wallet funded was successful';
            return { isSuccess: true, message, data: { user: user, wallet: walletn[0] } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    public async withdrawFunds(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, account_number, recieving_bank_account_number, recieving_bank_code } = req.body;

            const account = await sharedService.getAUser(user.email);

            // withdraw from user's wallet
            let wallet = await sharedService.getAUsersWallet(account[0].id);

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

            wallet = await knexapp('wallets')
                .where({ user_id: account[0].id, account_number: account_number })
                .decrement({
                    balance: amount,
                })

            // ---------------------------------------------------------------------
            // Call a third party API like Paystack to confirm account and make real life payment to bank account
            // ---------------------------------------------------------------------
            const message = 'Withdrawal was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    public async transferFund(req: Request): Promise<UserResponse> {
        try {
            const user = req.user;

            const { amount, receiver_user_id } = req.body;

            const account = await sharedService.getAUser(user.email);

            // get user's wallet
            const wallet = await sharedService.getAUsersWallet(account[0].id);

            if (!this.hasEnoughBalance(wallet[0], amount)) {
                const message = 'Insufficient balance';
                return { isSuccess: false, message };
            }
            // get receiver info
            const { receiver } = await this.confirmUserWallet(receiver_user_id);
            if (!receiver) return { isSuccess: false, message: 'Unable to fetch user wallet' };

            const { userWallet, receiverWallet } = await this.fundReceiverWallet(
                wallet[0].user_id,
                receiver.wallet.user_id,
                amount,
            );
            if (!userWallet && !receiverWallet) return { isSuccess: false, message: 'Unable to complete transaction' };

            const message = 'Transfer was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet[0] } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    public async confirmUserWallet(
        account_number: string,
    ): Promise<{ isSuccess: boolean; message: string; receiver: any }> {
        // get user's wallet
        const nwallet = await knexapp('wallets').where({ account_number: account_number });
        if (nwallet.length == 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Wallet not found');

        const recieverAccount = await knexapp('users').where({ id: nwallet[0].user_id });
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
            await knexapp('wallets').where({ user_id: sender_wallet_user_id }).decrement({
                balance: amount,
            }),

            // credit receiver wallet
            await knexapp('wallets').where({ user_id: receiver_wallet_user_id }).increment({
                balance: amount,
            }),
        ]);
        return { userWallet, receiverWallet };
    }

    private hasEnoughBalance(wallet: any, amount: number): boolean {
        if (wallet.balance > amount) return true;
        return false;
    }
}

const walletService = new WalletService();

export { walletService };
