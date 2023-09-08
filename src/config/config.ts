import dotenv from 'dotenv';
import fs from 'fs';
import { Config, AppEnv } from '../types/config';

export const appPrefix = '/api/v1';
(function loadEnv() {
    const envPath = '.env';
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
})();
export const ADM_KEY = process.env.ADM_KEY;
export const ADM_SALT = process.env.ADM_SALT;

export const getConfig = (): Config => {
    const required: string[] = [
        'APP_ENV',
        'APP_PORT',
    ];

    required.forEach((variable: string) => {
        if (!process.env[variable]) throw new Error(`${variable} env not set`);
    });

    return {
        appEnv: (process.env.APP_ENV as AppEnv) || AppEnv.DEVELOPMENT,
        environment: process.env.APP_ENV || AppEnv.DEVELOPMENT,
        isProduction: process.env.APP_ENV === AppEnv.PRODUCTION,
        isTest: process.env.APP_ENV === AppEnv.TEST,
        appPort: Number(process.env.APP_PORT) || 9000,
        appPrefixPath: process.env.APP_PREFIX_PATH || appPrefix,
        jwtSecret: process.env.JWT_SECRET || 'somerandomkeyherena',
        jwtExpire: process.env.JWT_EXPIRE || '1d',
    };
};

export default getConfig();

// 'ACTIVE_DIRECTORY_URL',
// 'HOST',
// 'SOAP_ACTION',


// activeDirectoryUrl: process.env.ACTIVE_DIRECTORY_URL,
// host: process.env.HOST,
// soapAction: process.env.SOAP_ACTION,
// dbUriTest: process.env.DB_URI_TEST,
// 
// relatedProductSize: Number(process.env.RELATED_PRODUCT_SIZE) || 5,