export interface IUser {
    first_name: string;
    last_name: string;
    phone_number?: string;
    email: string;
    password: string;
}

export interface IUserToAuthJSON {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    token?: string;
}

export interface UserResponse {
    isSuccess: boolean;
    message: string;
    data?: any;
}