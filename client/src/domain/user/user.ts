export interface IUser {
    id: string;
    name: string;
    description: string;
    password: string;
    email: string;
    avatar: string | null;
    favouritePosts: string[];
}