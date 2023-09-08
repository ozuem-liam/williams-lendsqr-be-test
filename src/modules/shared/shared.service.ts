import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import { knex } from '../../database/knex';

export class SharedService {
    public async getAUser(email: string): Promise<any> {
        const account = await knex('users')
            .where({ email: email })
            .select(
                'id',
                'user_id',
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'password',
                'salt',
                'created_at',
                'updated_at',
            );
        if (!account) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Account not found');

        return account;
    }

    public async getAUsersWallet(user_id: string): Promise<any> {
        const wallet = await knex('wallets')
                .where({ user_id: user_id })
                .select('id', 'account_number', 'balance', 'user_id');
        if (!wallet) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Wallet not found');

        return wallet;
    }
}
