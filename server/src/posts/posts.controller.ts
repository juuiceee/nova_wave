import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    getLimitPosts(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
        limit = limit > 20 ? 20 : limit
        return this.postService.getLimitPosts(limit, page)
    }
}
