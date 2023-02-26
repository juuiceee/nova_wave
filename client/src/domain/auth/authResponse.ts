import { IUser } from "../user/user";

export interface AuthResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
    user: IUser;
}