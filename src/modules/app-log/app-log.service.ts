import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import knex from 'knex';

export class AppLogService {
    public async getAppLogs(): Promise<any> {
        const appLog = await knex('app_logs')
            .where({})
            .select(
                'id',
                'level',
                'type',
                'app_name',
                'log_id',
                'code',
                'message',
                'data',
                'time',
                'created_at',
                'updated_at',
            );
        if (appLog.length > 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'AppLog not found');

        return appLog;
    }
}
