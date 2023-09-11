import knexapp from '../../database/knex';
import { UserResponse } from '../user/user.service';
import { sharedService } from '../shared/shared.service';

class TransactionService {
    public async getTransactions(req: any): Promise<UserResponse> {
        try {
            const user = req.user;
            const account = await sharedService.getAUser(user.email);

            const transactions = await knexapp('transactions')
                .where({ user_id: account[0].id })

            const message = 'Transactions retrieved created';

            return { isSuccess: true, message, data: transactions };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }
}

const transactionService = new TransactionService();
export { transactionService };