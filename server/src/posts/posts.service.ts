import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, Op } from 'sequelize';
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
        const user = await this.userService.getUserById(dto.userId)

        const post = await this.postRepository.create({
            ...dto,
            id: uuid.v4(),
            image: fileName,
            authorName: user.name,
            authorAvatar: user.avatar,
            createdDateTime: new Date()
        })
        return post;
    }

    async getLimitPostsByTime(limit: number, page: number) {
        const posts = await this.postRepository.findAndCountAll({
            limit,
            offset: page * limit,
            where: { isRemoved: false },
            order: [['createdDateTime', 'DESC']]
        })
        return posts
    }

    async getLimitPostsByLikes(limit: number, page: number) {
        const posts = await this.postRepository.findAndCountAll({
            limit,
            offset: page * limit,
            where: { isRemoved: false },
            order: [[fn('cardinality', col('usersLiked')), 'DESC']]
        })
        return posts
    }

    async getOnePost(id: uuid) {
        const post = await this.postRepository.findOne({ where: { id: id } })
        return post;
    }

    async getPostsByUserId(userId: uuid, limit: number, page: number) {
        const posts = await this.postRepository.findAndCountAll({
            where: { userId: userId, isRemoved: false },
            limit,
            offset: page * limit,
            order: [['createdDateTime', 'DESC']]
        })
        return posts;
    }

    async setLike(postId: uuid, userId: uuid) {
        const post = await this.getOnePost(postId)

        if (post.usersLiked.filter(user => user == userId).length > 0) {
            return await this.removeLike(post.id, userId)
        }

        post.usersLiked.unshift(userId);

        await this.postRepository.update({
            usersLiked: post.usersLiked
        },
            {
                where: { id: postId }
            })

        return post;
    }

    async removeLike(postId: uuid, userId: uuid) {
        const post = await this.getOnePost(postId)

        if (post.usersLiked.filter(user => user == userId).length == 0) {
            throw new HttpException('Пост еще не лайкнут', HttpStatus.BAD_REQUEST)
        }

        const removeIndex = post.usersLiked.indexOf(userId)
        post.usersLiked.splice(removeIndex, 1)

        await this.postRepository.update({ usersLiked: post.usersLiked }, { where: { id: postId } })
        return post;
    }

    async updateAllPostsByUser(userId: uuid, userName: string, avatar: string) {
        await this.postRepository.update({ authorName: userName, authorAvatar: avatar }, { where: [{ userId: userId }] })
    }

    async getFavouritePosts(userId: uuid, limit: number, page: number) {
        const user = await this.userService.getUserById(userId)
        const postIds = user.favouritePosts

        if (postIds.length == 0) return { rows: [], count: 0 }

        const posts = await this.postRepository.findAndCountAll({
            where: { id: { [Op.in]: postIds }, isRemoved: false },
            limit,
            offset: page * limit,
        })

        return posts
    }

    async editPost(dto: CreatePostDto, image?: any) {
        let fileName = dto.imageSrc ?? null;

        if (image != null)
            fileName = await this.fileService.createFile(image)

        await this.postRepository.update({ ...dto, image: fileName, updatedDateTime: new Date() }, { where: { id: dto.id } })
    }

    async deletePost(postId: uuid) {
        await this.postRepository.update({ isRemoved: true }, { where: { id: postId } })
    }
}
