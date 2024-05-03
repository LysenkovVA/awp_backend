import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignUpDto } from "./dto/sign-up.dto"
import { Request, Response } from "express"
import { ConfigService } from "@nestjs/config"
import { SignInDto } from "./dto/sign-in.dto"

@Controller("auth")
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    @Post("/signup")
    async signUp(
        @Res({ passthrough: true }) response: Response,
        @Body() signUpDto: SignUpDto,
    ) {
        const result = await this.authService.signUp(signUpDto)

        if (result) {
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get<boolean>("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            })
        } else {
            throw new BadRequestException(
                "Произошла ошибка при регистрации пользователя!",
            )
        }

        return result
    }

    @Post("/signin")
    async signIn(
        @Res({ passthrough: true }) response: Response,
        @Body() signInDto: SignInDto,
    ) {
        const result = await this.authService.signIn(signInDto)

        if (result) {
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get<boolean>("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            })
        } else {
            throw new BadRequestException(
                "Произошла ошибка при аутентификации пользователя!",
            )
        }

        return result
    }

    @Post("/logout")
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        // Получаем Cookie из запроса
        const { refreshToken } = request.cookies

        if (refreshToken) {
            // Удаляем токен из БД
            const result = await this.authService.logout(refreshToken)
            // Чистим Cookies из ответа
            response.clearCookie("refreshToken")
            response.status(200)
            return result
        }

        response.status(200)
    }

    @Get("/refresh")
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        // Получаем Cookie из запроса
        const { refreshToken } = request.cookies

        if (refreshToken) {
            const result =
                await this.authService.refreshAccessToken(refreshToken)
            response.status(200)
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get<boolean>("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            })

            return result
        } else {
            response.status(500)
            response.errored.message = "Не был найден Refresh-токен"
        }
    }
}
