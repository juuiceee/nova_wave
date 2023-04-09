import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as uuid from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) { }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image'))
    createPost(@Body() dto: CreatePostDto, @UploadedFile() image) {
        return this.postService.create(dto, image)
    }

    @Get('/getLimitPostsByTime')
    getLimitPostsByTime(@Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        limit = limit > 20 ? 20 : limit
        return this.postService.getLimitPostsByTime(limit, page)
    }

    @Get('/getLimitPostsByLikes')
    getLimitPostsByLikes(@Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        limit = limit > 20 ? 20 : limit
        return this.postService.getLimitPostsByLikes(limit, page)
    }

    @Get('getPost/:id')
    getOne(@Param('id') id: uuid) {
        return this.postService.getOnePost(id)
    }

    @Get('getPostsByUserId/:userId')
    getByUserId(@Param('userId') userId: uuid, @Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        limit = limit > 20 ? 20 : limit
        return this.postService.getPostsByUserId(userId, limit, page)
    }

    @Put('/like/:postId/:userId')
    like(@Param('postId') postId: uuid, @Param('userId') userId: uuid) {
        return this.postService.setLike(postId, userId)
    }

    @Get('/getFavoritePosts')
    getFavoritePosts(@Query('userid') userId: uuid, @Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        return this.postService.getFavouritePosts(userId, limit, page)
    }

    @Post('/editPost')
    @UseInterceptors(FileInterceptor('image'))
    editPost(@Body() dto: CreatePostDto, @UploadedFile() image) {
        return this.postService.editPost(dto, image)
    }

    @Post('/deletePost/:postId')
    deletePost(@Param('postId') postId: uuid) {
        return this.postService.deletePost(postId);
    }
}
