import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/login')
    async login(@Res() res: Response, @Req() req: Request) {
        const userDto = req.body
        const userData = await this.authService.login(userDto)
        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData)
    }

    @Post('/registration')
    async registration(@Res() res: Response, @Req() req: Request) {
        const userDto = req.body
        const userData = await this.authService.registration(userDto)
        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData)
    }

    @Post('/logout')
    async logout(@Res() res: Response, @Req() req: Request) {
        const { refreshToken } = req.cookies
        const token = await this.authService.logout(refreshToken)
        res.clearCookie('refreshToken')

        return res.json(token)
    }

    @Get('/refresh')
    async refresh(@Res() res: Response, @Req() req: Request) {
        const { refreshToken } = req.cookies
        const userData = await this.authService.refresh(refreshToken)
        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData)
    }
}
