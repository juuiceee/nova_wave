import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { IUser } from "./user";

export default class UserProvider {
    static async save(formData: FormData): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/users/save', formData)
    }

    static async setFavoritePost(userId: string, postId: string): Promise<AxiosResponse<IUser>> {
        return $api.put<IUser>(`/users/setFavouritePost/${postId}/${userId}`)
    }
}
