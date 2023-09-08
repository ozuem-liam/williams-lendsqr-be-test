export enum AppEnv {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export interface Config {
    appEnv: AppEnv;
    environment: string;
    isProduction: boolean;
    isTest: boolean;
    appPort: number;
    appPrefixPath: string;
    jwtSecret: string;
    jwtExpire: string;
}