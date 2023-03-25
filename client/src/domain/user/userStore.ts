import axios from "axios";
import { create } from "zustand";
import { API_URL } from "../../tools/http/http";
import AuthProvider from "../auth/authProvider";
import { AuthResponse } from "../auth/authResponse";
import { IUser } from "./user";

interface UserState {
    user: IUser | null,
    isAuth: boolean;
    setUser: (user: IUser) => void;
    setIsAuth: (isAuth: boolean) => void;
    logout: () => void;
    checkAuth: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuth: false,

    setUser: (user: IUser) => {
        set({ user })
    },

    setIsAuth: (isAuth: boolean) => {
        set({ isAuth })
    },

    logout: async () => {
        try {
            await AuthProvider.logout()
            localStorage.removeItem('token')
            set({ user: null, isAuth: false })
        } catch (e: any) {
            console.log(e.response.data.message)
        }
    },

    checkAuth: async () => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.tokens.accessToken)
            set({ user: response.data.user, isAuth: true })
        } catch (e: any) {
            console.log(e.response.data.message)
        }
    },
}))

export default useUserStore;