import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { IUser } from "./user";

export default class UserProvider {
    static async save(user: IUser): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/users/save', { ...user })
    }
}
