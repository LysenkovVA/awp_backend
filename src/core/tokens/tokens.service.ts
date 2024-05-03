import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { Token } from "./entities/token.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { TokenDto } from "./dto/token.dto"

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
    ) {}
    async create(tokenDto: TokenDto) {
        return this.tokenRepository.create(tokenDto)
    }

    async findRefreshToken(refreshToken: string) {
        return this.tokenRepository.findOne({ where: { refreshToken } })
    }

    async remove(tokens: Token[]) {
        if (tokens) {
            await this.tokenRepository.remove(tokens)
            return true
        }
        return false
    }
}
