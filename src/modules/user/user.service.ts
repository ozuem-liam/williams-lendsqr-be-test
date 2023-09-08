import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import { knex } from '../../database/knex';
import crypto from 'crypto';
import { IUser, IUserToAuthJSON } from '../../types/user';
import { seal } from '../../middlewares/jwt';
import Config from '../../config/config';

export interface UserResponce {
    isSuccess: boolean;
    message: string;
    data?: any;
}
export class UserService {
    public async createUser(req: any): Promise<UserResponce> {
        try {
            const { first_name, last_name, email, password, phone_number } = req.body;

            // Check if email is verified
            const isEmailVerified = await knex('users').where({ email: email });
            if (isEmailVerified) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Email already registered!');

            const { salt, hashedPassword } = await this.setPassword(password);

            const newUser = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone_number: phone_number,
                password: hashedPassword,
                salt: salt,
            };

            const user = await knex('users')
                .insert(newUser)
                .returning(['id', 'first_name', 'last_name', 'email', 'phone']);

            if (!user) {
                const message = 'Could not create account';
                return { isSuccess: false, message };
            }
            // Create user's wallet
            const wallet = await knex('wallets')
                .insert({ user_id: user[0].id, account_number: this.generateAccountNumber() })
                .returning(['id', 'account_number', 'balance', 'user_id']);

            const message = 'Account account created';

            // logger.(message);

            return { isSuccess: true, message, data: { user: user[0], wallet: wallet[0] } };
        } catch (e) {
            const message = 'Could not create account';
            return { isSuccess: false, message };
        }
    }

    public async loginUser(req: any): Promise<UserResponce> {
        try {
            const { email, password } = req.body;
            const account = await knex('users')
                .where({ email })
                .select('id', 'user_id', 'first_name', 'last_name', 'email', 'phone_number', 'password', 'salt');

            if (!account) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid account credentials!');

            if (!this.validPassword(password, account[0].password, account[0].salt)) {
                throw new ApiError(
                    httpStatus.UNPROCESSABLE_ENTITY,
                    'Invalid account credentials. Your account will be locked after 5 tries!',
                );
            }

            const wallet = await knex('wallets')
                .where({ user_id: account[0].user_id })
                .select('id', 'account_number', 'balance', 'user_id');

            const user = await this.toAuthJSON(account);
            const message = 'Login was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet[0] } };
        } catch (e) {
            const message = 'Could not log into account';
            return { isSuccess: false, message };
        }
    }

    private setPassword(password: string) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return { salt, hashedPassword };
    }

    private validPassword(password: string, hashedPassword: string, salt: string) {
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return hashedPassword === hash;
    }

    private async generateJWT(account: any[]): Promise<string> {
        const token = await seal(
            {
                email: account[0].email,
                first_name: account[0].first_name,
                last_name: account[0].last_name,
            },
            Config.jwtSecret,
            Config.jwtExpire,
        );

        return token;
    }

    private async toAuthJSON(account: any[]): Promise<IUserToAuthJSON> {
        const { id, user_id, first_name, last_name, email, phone_number } = account[0];
        return {
            id,
            user_id,
            first_name,
            last_name,
            email,
            phone_number,
            token: await this.generateJWT(account),
        };
    }

    private generateAccountNumber(): string {
        const length = 10;
        const characters = '0123456789'; // All possible digits
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }
}
