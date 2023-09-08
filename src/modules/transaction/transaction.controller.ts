import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import { TransactionService } from './transaction.service';
import { successResponse } from '../../utils/success-response';

export class TransactionController {
    transactionService = new TransactionService();

    public async getTransactions(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { isSuccess, message, data } = await this.transactionService.getTransactions(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }
}
