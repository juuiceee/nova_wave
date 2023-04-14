import { AxiosResponse } from "axios";
import $api from "../../tools/http/http";
import { IComment } from "./comment";

export default class CommentProvider {
    static async create(comment: IComment): Promise<AxiosResponse<void>> {
        return $api.post<void>('/comments/create', comment)
    }

    static async getCommentsByPostId(postId: string): Promise<AxiosResponse<IComment[]>> {
        return $api.get<IComment[]>(`/comments/getCommentsByPostId/${postId}`)
    }

    static async getCommentsByUserId(userId: string): Promise<AxiosResponse<IComment[]>> {
        return $api.get<IComment[]>(`/comments/getCommentsByUserId/${userId}`)
    }

    static async likeComment(commentId: string, userId: string): Promise<AxiosResponse<IComment>> {
        return $api.put<IComment>(`/comments/like/${commentId}/${userId}`)
    }

    static async getCommentCountByPostId(postId: string): Promise<AxiosResponse<number>> {
        return $api.get<number>(`/comments/getCommentCountByPostId/${postId}`)
    }
}