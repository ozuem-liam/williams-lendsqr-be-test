import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import { walletService } from './wallet.service';
import { successResponse } from '../../utils/success-response';
import { validateFundPayload, validateTransferPayload, validateWithdrawPayload } from './validator/wallet.validator';

export class WalletController {

    public async fundWallet(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { error } = await validateFundPayload(req.body);
            if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

            const { isSuccess, message, data } = await walletService.fundWallet(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }

    public async withdrawFunds(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { error } = await validateWithdrawPayload(req.body);
            if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

            const { isSuccess, message, data } = await walletService.withdrawFunds(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }

    public async transferFund(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { error } = await validateTransferPayload(req.body);
            if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

            const { isSuccess, message, data } = await walletService.transferFund(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }

    public async getWallet(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { isSuccess, message, data } = await walletService.getWallet(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }

    public async confirmUserWallet(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { isSuccess, message, receiver: data } = await walletService.confirmUserWallet(req);

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
