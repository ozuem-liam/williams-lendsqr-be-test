import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import Config from '../config/config';
import knexapp from '../database/knex';

/**
 * Generate token based on payload.
 */
export function seal(data: any, secret: string, ttl: number | string): Promise<string> {
    const expiresIn = typeof ttl === 'number' ? `${ttl}s` : ttl;
    return new Promise((resolve, reject) => {
        const claim = data.toJSON ? data.toJSON() : data;
        jwt.sign({ ...claim }, secret, { expiresIn }, (err, sig) => {
            if (err) return reject(err);
            resolve(sig);
        });
    });
}

/**
 * Verifies user provided token
 */
export function unseal(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, val) => {
            if (err) return reject(err);
            return resolve(val);
        });
    });
}

/**
 * Authenticate logged in user
 */
export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ');

        if (token && token[0] == 'Bearer') {
            const user = await unseal(token[1], Config.jwtSecret);

            const account = await knexapp('users')
                .where({ email: user.email })

            if (account.length == 0) throw new Error('unknown data detected!');

            req.user = account[0];
            next();
        } else {
            throw new Error();
        }
    } catch (err) {
        next(err);
    }
};
