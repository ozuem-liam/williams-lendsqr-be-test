import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import knexapp from '../../database/knex';
import crypto from 'crypto';
import { IUserToAuthJSON, UserResponse } from '../../types/user';
import { seal } from '../../middlewares/jwt';
import Config from '../../config/config';
import { sharedService } from '../shared/shared.service';

class UserService {
    public async createUser(req: any): Promise<UserResponse> {
        try {
            const { first_name, last_name, email, password, phone_number } = req.body;

            // Check if email is verified
            const isEmailVerified = await knexapp('users').where({ email: email });
            if (isEmailVerified.length > 0)
                throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Email already registered!');

            const { salt, hashedPassword } = await this.setPassword(password);

            const newUser = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone_number: phone_number,
                password: hashedPassword,
                salt: salt,
            };

            const user: any = await knexapp('users').insert(newUser);

            if (!user) {
                const message = 'Could not create account';
                return { isSuccess: false, message };
            }
            // Create user's wallet
            const wallet = await knexapp('wallets')
                .insert({ user_id: user[0], account_number: this.generateAccountNumber() });

            const createdUser = await knexapp('users').where({ id: user[0] })
            const usern = await this.toAuthJSON(createdUser[0]);

            const createdWallet = await knexapp('wallets').where({ id: wallet[0] })

            const message = 'Account account created';

            return { isSuccess: true, message, data: { user: usern,  wallet: createdWallet[0] } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    public async loginUser(req: any): Promise<UserResponse> {
        try {
            const { email, password } = req.body;

            const account = await sharedService.getAUser(email);

            if (!this.validPassword(password, account[0].password, account[0].salt)) {
                throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid account credentials');
            }

            const wallet = await sharedService.getAUsersWallet(account[0].id);

            const user = await this.toAuthJSON(account[0]);
            const message = 'Login was successful';
            return { isSuccess: true, message, data: { user: user, wallet: wallet[0] } };
        } catch (e) {
            const message = e.message;
            return { isSuccess: false, message };
        }
    }

    private setPassword(password: string) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex').substring(0, 10);
        return { salt, hashedPassword };
    }

    private validPassword(password: string, hashedPassword: string, salt: string) {
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return hashedPassword === hash.substring(0, 10);
    }

    private async generateJWT(account: any): Promise<string> {
        const token = await seal(
            {
                email: account.email,
                first_name: account.first_name,
                last_name: account.last_name,
            },
            Config.jwtSecret,
            Config.jwtExpire,
        );

        return token;
    }

    private async toAuthJSON(account: any): Promise<IUserToAuthJSON> {
        const { id, user_id, first_name, last_name, email, phone_number } = account;
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

const userService = new UserService();
export { UserResponse, userService };
