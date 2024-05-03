import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common"
import { SignInDto } from "./dto/sign-in.dto"
import { JwtService } from "@nestjs/jwt"
import { SignUpDto } from "./dto/sign-up.dto"
import { ConfigService } from "@nestjs/config"
import { UsersService } from "../users/users.service"
import { DataSource, EntityManager } from "typeorm"
import { User } from "../users/entities/user.entity"
import { TokensService } from "../tokens/tokens.service"
import { ProfilesService } from "../profiles/profiles.service"
import * as bcrypt from "bcryptjs"

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
     * @param signUpDto
     */
    async signUp(signUpDto: SignUpDto) {
        const candidate = await this.usersService.findByLogin(signUpDto.login)

        if (candidate) {
            throw new BadRequestException({
                message: `Пользователь с логином '${signUpDto.login}' уже зарегистрирован!`,
            })
        }

        // Транзакция
        return await this.dataSource.transaction(
            async (entityManager: EntityManager) => {
                const user = await this.usersService.create({
                    login: signUpDto.login,
                    password: signUpDto.password,
                })

                const profile = await this.profilesService.create({})
                await entityManager.save(profile)

                // Генерируем токены
                const accessToken = await this.generateAccessToken(user)
                const refreshToken = await this.generateRefreshToken(user)

                // Создаем токен
                const token = await this.tokenService.create({ refreshToken })
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
     * @param signInDto
     */
    async signIn(signInDto: SignInDto) {
        // Транзакция
        return await this.dataSource.transaction(
            async (entityManager: EntityManager) => {
                // Ищем пользователя и проверяем правильность пароля
                const user = await this.usersService.findByLogin(
                    signInDto.login,
                )

                if (!user) {
                    throw new BadRequestException({
                        message: `Пользователь '${signInDto.login}' не существует!`,
                    })
                }

                // Здесь await нужен, иначе не срабатывает!
                // .then нужен чтобы среда не подсвечивала синтаксис
                const passwordEquals = await bcrypt
                    .compare(signInDto.password, user.password)
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
                await this.tokenService.remove(tokens)

                // Создаем токен
                const token = await this.tokenService.create({ refreshToken })
                await entityManager.save(token)

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
        }

        return true
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
