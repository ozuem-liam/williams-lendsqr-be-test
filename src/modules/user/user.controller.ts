import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import { validateCreateUser, validateLoginUser } from './validator/user.validator';
import { userService } from './user.service';
import { successResponse } from '../../utils/success-response';

export class UserController {

    public async createUser(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { error } = await validateCreateUser(req.body);
            if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

            const { isSuccess, message, data } = await userService.createUser(req);

            if (isSuccess) {
                return successResponse(httpStatus.CREATED, res, message, data)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, message);
            }
        } catch (error) {
            next(error);
        }
    }

    public async loginUser(req: any, res: any, next: (error: any) => Promise<void>) {
        try {
            const { error } = await validateLoginUser(req.body);
            if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

            const { isSuccess, message, data } = await userService.loginUser(req);

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
