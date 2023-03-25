import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get('/getAll')
    getUsers() {
        return this.userService.getAllUsers()
    }

    @Post('/save')
    @UseInterceptors(FileInterceptor('avatar'))
    save(@Body() dto: CreateUserDto, @UploadedFile() image) {
        return this.userService.saveUser(dto, image)
    }

    @Put('/setFavouritePost/:postId/:userId')
    like(@Param('postId') postId: uuid, @Param('userId') userId: uuid) {
        return this.userService.setFavouritePost(postId, userId)
    }
}
