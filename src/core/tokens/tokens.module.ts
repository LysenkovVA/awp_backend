import { Module } from "@nestjs/common"
import { TokensService } from "./tokens.service"
import { TokensController } from "./tokens.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Token } from "./entities/token.entity"

@Module({
    controllers: [TokensController],
    providers: [TokensService],
    exports: [TokensService],
    imports: [TypeOrmModule.forFeature([Token])],
})
export class TokensModule {}
