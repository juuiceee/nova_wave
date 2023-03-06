import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import * as uuid from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.model';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post) private postRepository: typeof Post, private fileService: FilesService, private userService: UsersService) { }

    async create(dto: CreatePostDto, image?: any) {
        const fileName = await this.fileService.createFile(image)
        const post = await this.postRepository.create({ ...dto, id: uuid.v4(), image: fileName })
        return post;
    }

    async getLimitPosts(limit: number, page: number) {
        const posts = await this.postRepository.findAndCountAll({ limit, offset: page * limit, order: [['createdAt', 'DESC']] })
        const userIds = posts.rows.map(p => p.userId);
        const users = await this.userService.getUsersByIds(userIds); //придумать как получать пользователя для поста
        return posts
    }

    async getOnePost(id: uuid) {
        const post = await this.postRepository.findOne({ where: { id: id } })
        return post;
    }

    async getPostsByUserId(userId: uuid, limit: number, page: number) {
        const posts = await this.postRepository.findAndCountAll({ where: { userId: userId }, limit, offset: page * limit, order: [['createdAt', 'DESC']] })
        return posts;
    }
}
