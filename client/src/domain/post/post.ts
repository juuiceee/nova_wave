export interface IPost {
    id: string;
    title: string;
    content: string;
    image: string | null;
    usersLiked: string[];
    authorName: string;
    authorAvatar: string;
    userId: string;
    createdDateTime: Date
}