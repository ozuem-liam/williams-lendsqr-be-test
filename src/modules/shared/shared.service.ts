import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import knexapp from '../../database/knex';

class SharedService {
    public async getAUser(email: string): Promise<any> {
        const account = await knexapp('users').where({ email: email });

        if (account.length > 0) {
            return account;
        }
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Account not found');
    }

    public async getAUsersWallet(user_id: number): Promise<any> {
        const wallet = await knexapp('wallets').where({ user_id: user_id });
        if (wallet.length > 0) {
            return wallet;
        }
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Wallet not found');
    }
}

const sharedService = new SharedService();
export { sharedService };
