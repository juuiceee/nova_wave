export interface IComment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatarPath: string | null;
    text: string;
    usersLiked: string[];
    createdDateTime: Date;
}