import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import { AppLogService } from './app-log.service';
import { successResponse } from '../../utils/success-response';

export class AppLogController {
    appLogService = new AppLogService();

    public async getAppLogs(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { isSuccess, message, data } = await this.appLogService.getAppLogs();

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
