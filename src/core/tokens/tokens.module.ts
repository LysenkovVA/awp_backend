import { Module } from "@nestjs/common"
import { TokensService } from "./tokens.service"
import { TokensResolver } from "./tokens.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Token } from "./entities/token.entity"

@Module({
    providers: [TokensResolver, TokensService],
    exports: [TokensService],
    imports: [TypeOrmModule.forFeature([Token])],
})
export class TokensModule {}
