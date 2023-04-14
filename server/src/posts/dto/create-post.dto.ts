import * as uuid from 'uuid';

export class CreatePostDto {
    readonly id: uuid;
    readonly title: string;
    readonly content: string;
    readonly userId: uuid;
    readonly imageSrc: string;
    readonly createdDateTime: Date;
}