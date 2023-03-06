import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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

    @Get('/getLimitPosts')
    getLimitPosts(@Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        limit = limit > 20 ? 20 : limit
        return this.postService.getLimitPosts(limit, page)
    }

    @Get('getPost/:id')
    getOne(@Param('id') id: uuid) {
        return this.postService.getOnePost(id)
    }

    @Get('getPostsByUserId/:userId')
    getByUserId(@Param('userId') userId: uuid, @Query('limit') limit: number = 10, @Query('page') page: number = 0) {
        return this.postService.getPostsByUserId(userId, limit, page)
    }
}
