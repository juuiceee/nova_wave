import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommentsService } from 'src/comments/comments.service';
import { FilesService } from 'src/files/files.service';
import { PostsService } from 'src/posts/posts.service';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User, private fileService: FilesService,
        @Inject(forwardRef(() => PostsService)) private postService: PostsService,
        @Inject(forwardRef(() => CommentsService)) private commentService: CommentsService) { }

    async createUser(dto: CreateUserDto, hashPassword: string) {
        if (dto.name.length < 4 || dto.name.length > 16)
            throw new HttpException('Некорректное имя', HttpStatus.BAD_REQUEST)

        if (dto.email.length < 1 || !this.validateEmail(dto.email))
            throw new HttpException('Некорректный email', HttpStatus.BAD_REQUEST)

        if (dto.password.length < 4 || dto.password.length > 16)
            throw new HttpException('Некорректный пароль', HttpStatus.BAD_REQUEST)

        const user = await this.userRepository.create({
            ...dto,
            id: uuid.v4(),
            description: "",
            password: hashPassword,
            avatar: "defaultAvatar.png",
            createdDateTime: new Date()
        })
        return user;
    }

    async saveUser(userDto: CreateUserDto, image?: any) {
        const sameEmail = await this.getUserByEmail(userDto.email)
        const sameName = await this.getUserByName(userDto.name)

        if (sameEmail && sameEmail.id != userDto.id)
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)

        if (sameName && sameName.id != userDto.id)
            throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.BAD_REQUEST)

        let fileName = userDto.avatarSrc

        if (userDto.avatarSrc == "")
            fileName = "defaultAvatar.png"
        if (image != null)
            fileName = await this.fileService.createFile(image)

        await this.postService.updateAllPostsByUser(userDto.id, userDto.name, fileName)
        await this.commentService.updateAllCommentsByUser(userDto.id, userDto.name, fileName)

        await this.userRepository.update({
            email: userDto.email,
            name: userDto.name,
            description: userDto.description,
            avatar: fileName,
            updatedDateTime: new Date()
        }, { where: { id: userDto.id } })
    }

    async setFavouritePost(postId: uuid, userId: uuid) {
        const user = await this.getUserById(userId)

        if (user.favouritePosts.filter(post => post == postId).length > 0) {
            return await this.removeFavouritePost(postId, user.id)
        }

        user.favouritePosts.unshift(postId);

        await this.userRepository.update({ favouritePosts: user.favouritePosts }, { where: { id: userId } })
        return user;
    }

    async removeFavouritePost(postId: uuid, userId: uuid) {
        const user = await this.getUserById(userId)

        if (user.favouritePosts.filter(post => post == postId).length == 0) {
            throw new HttpException('Пост еще не в избранном', HttpStatus.BAD_REQUEST)
        }

        const removeIndex = user.favouritePosts.indexOf(postId)
        user.favouritePosts.splice(removeIndex, 1)

        await this.userRepository.update({ favouritePosts: user.favouritePosts }, { where: { id: userId } })
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } })
        return user
    }

    async getUserByName(name: string) {
        const user = await this.userRepository.findOne({ where: { name } })
        return user
    }

    async getUserById(id: uuid) {
        const user = await this.userRepository.findOne({ where: { id } })
        return user
    }

    async getUsersByIds(ids: uuid[]) {
        const users = await this.userRepository.findAll({ where: { id: { [Op.in]: ids } } })
        return users
    }

    private validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
}