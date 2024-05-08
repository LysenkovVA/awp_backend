import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common"
import { User } from "../users/entities/user.entity"
import * as bcrypt from "bcryptjs"
import { DataSource, EntityManager } from "typeorm"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { UsersService } from "../users/users.service"
import { TokensService } from "../tokens/tokens.service"
import { ProfilesService } from "../profiles/profiles.service"
import { SignUpInput } from "./dto/sign-up.input"
import { SignInInput } from "./dto/sign-in.dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly tokenService: TokensService,
        private readonly profilesService: ProfilesService,
    ) {}

    /**
     * Регистрация пользователя
     * @param signUpInput
     */
    async signUp(signUpInput: SignUpInput) {
        const candidate = await this.usersService.findByLogin(signUpInput.login)

        if (candidate) {
            throw new BadRequestException({
                message: `Пользователь с логином '${signUpInput.login}' уже зарегистрирован!`,
            })
        }

        // Транзакция
        return await this.dataSource.transaction(
            async (entityManager: EntityManager) => {
                const user = await this.usersService.create({
                    login: signUpInput.login,
                    password: signUpInput.password,
                })

                const profile = await this.profilesService.create({
                    firstName: null,
                    lastName: null,
                })
                await entityManager.save(profile)

                // Генерируем токены
                const accessToken = await this.generateAccessToken(user)
                const refreshToken = await this.generateRefreshToken(user)

                // Создаем токен
                const token = await this.tokenService.create({
                    fingerPrint: null,
                    refreshToken,
                })
                await entityManager.save(token)

                // Связываем профиль и токен с пользователем
                user.profile = Promise.resolve(profile)
                user.tokens = Promise.resolve([token])

                await entityManager.save(user)

                return {
                    user: {
                        id: user.id,
                        login: user.login,
                    },
                    accessToken,
                    refreshToken,
                }
            },
        )
    }

    /**
     * Авторизация пользователя
     * @param signInInput
     */
    async signIn(signInInput: SignInInput) {
        // Транзакция
        return await this.dataSource.transaction(
            async (entityManager: EntityManager) => {
                // Ищем пользователя и проверяем правильность пароля
                const user = await this.usersService.findByLogin(
                    signInInput.login,
                )

                if (!user) {
                    throw new BadRequestException({
                        message: `Пользователь '${signInInput.login}' не существует!`,
                    })
                }

                // Здесь await нужен, иначе не срабатывает!
                // .then нужен чтобы среда не подсвечивала синтаксис
                const passwordEquals = await bcrypt
                    .compare(signInInput.password, user.password)
                    .then((resolve) => resolve)

                if (!passwordEquals) {
                    throw new BadRequestException({
                        message: `Неверный пароль!`,
                    })
                }

                // Генерируем токены
                const accessToken = await this.generateAccessToken(user)
                const refreshToken = await this.generateRefreshToken(user)

                // Удаляем ВСЕ старые токены
                const tokens = await user.tokens

                if (tokens) {
                    const res = await this.tokenService.remove(tokens)
                }

                // Создаем токен
                const token = await this.tokenService.create({
                    fingerPrint: null,
                    refreshToken,
                })

                await entityManager.save(token, { reload: true })

                // Связываем токен с пользователем
                user.tokens = Promise.resolve([token])

                await entityManager.save(user)

                return {
                    user,
                    accessToken,
                    refreshToken,
                }
            },
        )
    }

    /**
     * Выход из приложения
     * @param refreshToken
     */
    async logout(refreshToken: string) {
        const token = await this.tokenService.findRefreshToken(refreshToken)

        if (token) {
            await this.tokenService.remove([token])
            return true
        }

        return false
    }

    /**
     * Обновление access-токена
     * @param refreshToken
     */
    async refreshAccessToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException("Токен не найден!")
        }

        // Валидация
        const payload = await this.verifyRefreshToken(refreshToken)

        // Поиск в БД
        const token = this.tokenService.findRefreshToken(refreshToken)

        if (!payload || !token) {
            throw new UnauthorizedException("Ошибка верификации токена!")
        }

        // Получаем id пользователя
        const { login } = payload

        if (login) {
            // Получаем пользователя из БД с актуальными данными
            const user = await this.usersService.findByLogin(login)

            if (!user) {
                throw new InternalServerErrorException(
                    "Пользователь из токена не существует!",
                )
            }

            // Генерируем access токен
            const accessToken = await this.generateAccessToken(user)

            return {
                user,
                accessToken,
                refreshToken,
            }
        }
    }

    private async generateAccessToken(user: User) {
        const payload = { id: user.id, login: user.login }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_KEY"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_TTL"),
        })
    }

    private async generateRefreshToken(user: User) {
        const payload = { id: user.id, login: user.login }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_KEY"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_TTL"),
        })
    }

    private async verifyAccessToken(accessToken: string) {
        try {
            return this.jwtService.verify(accessToken, {
                secret: this.configService.get<string>("JWT_ACCESS_TOKEN_KEY"),
            })
        } catch {
            return null
        }
    }

    private async verifyRefreshToken(refreshToken: string) {
        try {
            return this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_KEY"),
            })
        } catch {
            return null
        }
    }
}
