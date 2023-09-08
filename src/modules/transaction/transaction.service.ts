import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import { knex } from '../../database/knex';
import { UserResponse } from '../user/user.service';
import { SharedService } from '../shared/shared.service';

export class TransactionService {
    sharedService = new SharedService();

    public async getTransactions(req: any): Promise<UserResponse> {
        try {
            const user = req.user;
            const account = await this.sharedService.getAUser(user.email);

            const transactions = await knex('transactions')
                .where({ user_id: account.user_id })
                .select('id', 'user_id', 'transaction_id', 'amount', 'transaction_type', 'description', 'receiving_recipient', 'created_at', 'updated_at');

            const message = 'Transactions retrieved created';

            return { isSuccess: true, message, data: transactions };
        } catch (e) {
            const message = 'Could not get wallet';
            return { isSuccess: false, message };
        }
    }
}
