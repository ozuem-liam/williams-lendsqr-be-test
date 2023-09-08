import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request extends ExpressRequest {
    req: any;
    request_id: string;
    user: any;
}

export interface Response extends ExpressResponse {
    request_id: string;
}

export { NextFunction, Router } from 'express';
