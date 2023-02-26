import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) { }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
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

    async createUser(dto: CreateUserDto) {
        if (dto.name.length < 4 || dto.name.length > 16)
            throw new HttpException('Некорректное имя', HttpStatus.BAD_REQUEST)

        if (dto.email.length < 1 || !this.validateEmail(dto.email))
            throw new HttpException('Некорректный email', HttpStatus.BAD_REQUEST)

        if (dto.password.length < 4 || dto.password.length > 16)
            throw new HttpException('Некорректный пароль', HttpStatus.BAD_REQUEST)

        const role = await this.roleService.getRoleByValue('USER')
        const user = await this.userRepository.create({ ...dto, id: uuid.v4(), roleId: role.id })
        return user;
    }

    async saveUser(userDto: CreateUserDto) {
        const sameEmail = await this.getUserByEmail(userDto.email)
        const sameName = await this.getUserByName(userDto.name)

        if (sameEmail && sameEmail.id != userDto.id)
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)

        if (sameName && sameName.id != userDto.id)
            throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.BAD_REQUEST)

        await this.userRepository.update({
            email: userDto.email,
            name: userDto.name,
            description: userDto.description

        }, { where: { id: userDto.id } })
    }

    private validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
}