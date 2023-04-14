import * as uuid from 'uuid';

export class CreateCommentDto {
    readonly id: uuid;
    readonly postId: uuid;
    readonly userId: uuid;
    readonly text: string;
}