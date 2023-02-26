import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { Pagination } from "../../tools/pagination/pagination";
import { IPost } from "./post";

export default class PostProvider {
    static async create(post: IPost): Promise<AxiosResponse<void>> {
        return $api.post<void>('/posts/create', { ...post })
    }

    static async getLimitPosts(limit: number, page: number): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getLimitPosts?limit=${limit}&page=${page}`)
    }
}