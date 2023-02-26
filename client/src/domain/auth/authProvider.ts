import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { AuthResponse } from "./authResponse";


export default class AuthProvider {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', { email, password })
    }

    static async registration(email: string, password: string, name: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/registration', { email, password, name })
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }
}
