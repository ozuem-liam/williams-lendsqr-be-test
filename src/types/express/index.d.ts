import 'express';

declare module 'express' {
    interface Request {
        user?: any;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
