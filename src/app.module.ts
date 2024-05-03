import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./core/auth/auth.module"
import { UsersModule } from "./core/users/users.module"
import { TokensModule } from "./core/tokens/tokens.module"
import process from "process"
import { JwtModule } from "@nestjs/jwt"
import { join } from "path"
import { ProfilesModule } from './core/profiles/profiles.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // Используем crossenv для пробрасывания переменных в package.json
            envFilePath: `.${process.env.NODE_ENV}.env`,
            cache: true,
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            // Все переменные берем из файла конфигурации, загруженного
            // через ConfigModule
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [join(__dirname, "/core/**/**.entity{.ts,.js}")],
            synchronize: true,
        }),
        JwtModule,
        AuthModule,
        UsersModule,
        TokensModule,
        ProfilesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
