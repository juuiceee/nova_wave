import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize/dist';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import * as uuid from 'uuid';
import { Token } from './token.model';

@Injectable()
export class AuthService {
    constructor(@InjectModel(Token) private tokenRepository: typeof Token, private userService: UsersService, private jwtService: JwtService) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        const tokens = await this.generateTokens(user)
        await this.saveToken(user.id, tokens.refreshToken)

        return { tokens, user }
    }

    async registration(userDto: CreateUserDto) {
        const sameEmail = await this.userService.getUserByEmail(userDto.email)
        const sameName = await this.userService.getUserByName(userDto.name)

        if (sameEmail)
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)

        if (sameName)
            throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.BAD_REQUEST)

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword })
        const tokens = await this.generateTokens(user)
        await this.saveToken(user.id, tokens.refreshToken)

        return { tokens, user }
    }

    async logout(refreshToken: string) {
        const token = await this.removeToken(refreshToken)
        return token;
    }

    async refresh(refreshToken: string) {
        const userData = await this.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.tokenRepository.findOne({ where: { refreshToken } })

        if (!userData || !tokenFromDb) {
            throw new HttpException('Пользователь не авторизован', HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.getUserById(userData.id)
        const tokens = await this.generateTokens(user)
        await this.saveToken(user.id, tokens.refreshToken)

        return { tokens, user }
    }

    private async validateAccessToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET })
            return userData;
        } catch (error) {
            return null
        }
    }

    private async validateRefreshToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET })
            return userData;
        } catch (error) {
            return null
        }
    }

    private async removeToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.destroy({ where: { refreshToken } })
        return tokenData;
    }

    private async generateTokens(user: User) {
        const payload = { email: user.email, id: user.id, role: user.roleId }

        const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m' })
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' })

        return { accessToken: accessToken, refreshToken: refreshToken }
    }

    private async saveToken(userId: uuid, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({ where: { userId } })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save();
        }

        const token = await this.tokenRepository.create({ userId, refreshToken })
        return token
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        if (!user)
            throw new HttpException('Не верный email', HttpStatus.BAD_REQUEST)

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals)
            throw new HttpException('Не верный пароль', HttpStatus.BAD_REQUEST)

        return user
    }
}
