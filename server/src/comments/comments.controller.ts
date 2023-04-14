import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import * as uuid from 'uuid';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {

    constructor(private commentService: CommentsService) { }

    @Post('/create')
    createComment(@Body() dto: CreateCommentDto) {
        return this.commentService.create(dto)
    }

    @Get('/getCommentsByPostId/:postId')
    getCommentsByPostId(@Param('postId') postId: uuid) {
        return this.commentService.getCommentsByPostId(postId)
    }

    @Get('/getCommentsByUserId/:userId')
    getCommentsByUserId(@Param('userId') postId: uuid) {
        return this.commentService.getCommentsByUserId(postId)
    }

    @Put('/like/:commentId/:userId')
    like(@Param('commentId') commentId: uuid, @Param('userId') userId: uuid) {
        return this.commentService.setLike(commentId, userId)
    }

    @Get('/getCommentCountByPostId/:postId')
    getCommentCountByPostId(@Param('postId') postId: uuid) {
        return this.commentService.getCommentCountByPostId(postId)
    }
}
