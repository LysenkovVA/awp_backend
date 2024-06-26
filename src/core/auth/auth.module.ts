import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthResolver } from "./auth.resolver"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UsersModule } from "../users/users.module"
import { TokensModule } from "../tokens/tokens.module"
import { ProfilesModule } from "../profiles/profiles.module"

@Module({
    providers: [AuthResolver, AuthService],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_ACCESS_TOKEN_KEY"),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        TokensModule,
        ProfilesModule,
    ],
    exports: [AuthService],
})
export class AuthModule {}
