import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { Pagination } from "../../tools/pagination/pagination";
import { IPost } from "./post";

export default class PostProvider {
    static async create(formData: FormData): Promise<AxiosResponse<void>> {
        return $api.post<void>('/posts/create', formData)
    }

    static async getLimitPosts(limit: number, page: number): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getLimitPosts?limit=${limit}&page=${page}`)
    }

    static async getPostById(id: string): Promise<AxiosResponse<IPost>> {
        return $api.get<IPost>(`/posts/getPost/${id}`)
    }

    static async getPostsByUserId(userId: string): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getPostsByUserId/${userId}`)
    }
}