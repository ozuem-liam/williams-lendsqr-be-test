import pino from 'pino';
import Config from './config';
import { knex } from '../database/knex';
import { Log, LogLevels, LogTransport, LogTypes, LogWriteObject, UnknownObject, LogQueryCriteria } from '../types/log';
import { AppEnv } from '../types/config';
import { Request, Response, NextFunction } from '../types/app';
import { generateString } from '../utils/services/generateString';

const { appEnv } = Config;

/* eslint-disable @typescript-eslint/no-explicit-any,no-console */

const formatLogResults = (results: any[] = []): Log[] => {
    return results.map((result) => ({
        level: result.level,
        type: result.type,
        data: JSON.parse(result.data),
        code: Number(result.code),
        id: result.id,
        message: result.message,
    }));
};

function buildLogTransport(): LogTransport {
    return {
        write(log: string) {
            try {
                const logObject: LogWriteObject = JSON.parse(log);
                knex('app_log').insert({
                    level: logObject.level,
                    time: logObject.time,
                    app_name: logObject.name,
                    message: logObject.message || logObject.msg,
                    code: logObject.code,
                    log_id: logObject.id,
                    type: logObject.type,
                    data: log,
                }).then();
                return;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        },

        async getLogs(criteria: LogQueryCriteria) {
            const { limit = 100 } = criteria;
            const filter = handleLogQuery(criteria);

            const results = await knex('app_log').where(filter).limit(limit);

            return formatLogResults(results);
        },
    };
}

const consoleTransport: LogTransport = {
    write(log: any) {
        console.log(log);
        return;
    },
    getLogs() {
        return Promise.resolve([]);
    },
};

class LogService {
    transport: LogTransport;
    logger: any;

    constructor(transport: LogTransport = consoleTransport) {
        this.transport = transport;
        this.logger = pino({ name: 'bubbles-api', redact: ['password'] }, transport);
    }

    log({ level, type, data, message, id = generateString() }: Log): void {
        this.logger[level]({ ...data, id, type, level }, message || String(data.message));
        return;
    }

    info(data: UnknownObject, message?: string): void {
        return this.log({ data, level: LogLevels.info, type: LogTypes.info, message });
    }

    error(err: Error, message?: string): void {
        return this.log({ data: err, level: LogLevels.error, type: LogTypes.error, message });
    }

    fatal(err: Error, message?: string): void {
        return this.log({ data: err, level: LogLevels.fatal, type: LogTypes.fatal, message });
    }

    request(id: string, data: UnknownObject): void {
        return this.log({ id, data, level: LogLevels.info, type: LogTypes.request });
    }

    response(id: string, code: number, response: UnknownObject): void {
        return this.log({ id, data: { ...response, code }, level: LogLevels.info, type: LogTypes.response });
    }
}

const Logger = new LogService(appEnv === AppEnv.PRODUCTION ? buildLogTransport() : undefined);

export function logRequestMiddleware() {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function (req: Request, res: Response, next: NextFunction) {
        const requestId = generateString();
        req.request_id = requestId;
        res.request_id = requestId;
        Logger.request(requestId, {
            route: req.route,
            url: req.url,
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    };
}

const handleLogQuery = (query: LogQueryCriteria) => {
    const filter = {} as any;
    if (query.code) filter.code = query.code;
    if (query.log_id) filter.log_id = query.log_id;
    if (query.type) filter.type = query.type;
    if (query.app_name) filter.app_name = query.app_name;

    return filter;
};

export default Logger;
