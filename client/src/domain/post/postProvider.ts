import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { Pagination } from "../../tools/pagination/pagination";
import { IPost } from "./post";

export default class PostProvider {
    static async create(formData: FormData): Promise<AxiosResponse<void>> {
        return $api.post<void>('/posts/create', formData)
    }

    static async getLimitPostsByTime(limit: number, page: number): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getLimitPostsByTime?limit=${limit}&page=${page}`)
    }

    static async getLimitPostsByLikes(limit: number, page: number): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getLimitPostsByLikes?limit=${limit}&page=${page}`)
    }

    static async getFavouritePosts(userId: string, limit: number, page: number): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getFavoritePosts?limit=${limit}&page=${page}&userid=${userId}`)
    }

    static async getPostById(id: string): Promise<AxiosResponse<IPost>> {
        return $api.get<IPost>(`/posts/getPost/${id}`)
    }

    static async getPostsByUserId(userId: string): Promise<AxiosResponse<Pagination<IPost[]>>> {
        return $api.get<Pagination<IPost[]>>(`/posts/getPostsByUserId/${userId}`)
    }

    static async likePost(userId: string, postId: string): Promise<AxiosResponse<IPost>> {
        return $api.put<IPost>(`/posts/like/${postId}/${userId}`)
    }

    static async edit(formData: FormData): Promise<AxiosResponse<void>> {
        return $api.post<void>('/posts/editPost', formData)
    }

    static async deletePost(postId: string): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/posts/deletePost/${postId}`)
    }
}