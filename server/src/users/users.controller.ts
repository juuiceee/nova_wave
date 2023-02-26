import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get('/getAll')
    getUsers() {
        return this.userService.getAllUsers()
    }

    @Post('/create')
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto)
    }

    @Post('/save')
    save(@Body() userDto: CreateUserDto) {
        return this.userService.saveUser(userDto)
    }
}
