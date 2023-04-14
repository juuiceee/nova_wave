import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import * as uuid from 'uuid';
import { Comment } from './comments.model';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentRepository: typeof Comment, private userService: UsersService) { }

    async create(dto: CreateCommentDto) {
        const user = await this.userService.getUserById(dto.userId)

        const comment = await this.commentRepository.create({
            ...dto,
            id: uuid.v4(),
            userAvatarPath: user.avatar,
            userName: user.name,
            createdDateTime: new Date()
        })

        return comment;
    }

    async getCommentById(commentId: uuid) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } })
        return comment;
    }

    async getCommentsByPostId(postId: uuid) {
        const comments = await this.commentRepository.findAll({ where: { postId }, order: [['createdDateTime', 'DESC']] })
        return comments;
    }

    async getCommentsByUserId(userId: uuid) {
        const comments = await this.commentRepository.findAll({ where: { userId }, order: [['createdDateTime', 'DESC']] })
        return comments;
    }

    async setLike(commentId: uuid, userId: uuid) {
        const comment = await this.getCommentById(commentId)

        if (comment.usersLiked.filter(user => user == userId).length > 0) {
            return await this.removeLike(comment.id, userId)
        }

        comment.usersLiked.unshift(userId);

        await this.commentRepository.update({
            usersLiked: comment.usersLiked
        },
            {
                where: { id: commentId }
            })

        return comment;
    }

    async removeLike(commentId: uuid, userId: uuid) {
        const comment = await this.getCommentById(commentId)

        if (comment.usersLiked.filter(user => user == userId).length == 0) {
            throw new HttpException('Комментарий еще не лайкнут', HttpStatus.BAD_REQUEST)
        }

        const removeIndex = comment.usersLiked.indexOf(userId)
        comment.usersLiked.splice(removeIndex, 1)

        await this.commentRepository.update({ usersLiked: comment.usersLiked }, { where: { id: commentId } })
        return comment;
    }

    async getCommentCountByPostId(postId: uuid) {
        const count = await this.commentRepository.count({ where: { postId } })
        return count;
    }

    async updateAllCommentsByUser(userId: uuid, userName: string, avatar: string) {
        await this.commentRepository.update({ userName: userName, userAvatarPath: avatar }, { where: [{ userId: userId }] })
    }
}
