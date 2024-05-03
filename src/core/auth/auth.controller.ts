import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Res,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignUpDto } from "./dto/sign-up.dto"
import { Response } from "express"
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
}
