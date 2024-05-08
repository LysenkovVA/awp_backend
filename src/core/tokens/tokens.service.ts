import { Injectable } from "@nestjs/common"
import { CreateTokenInput } from "./dto/create-token.input"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Token } from "./entities/token.entity"

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Token)
        private tokensRepository: Repository<Token>,
    ) {}

    async create(createTokenInput: CreateTokenInput) {
        return this.tokensRepository.create(createTokenInput)
    }

    async findRefreshToken(refreshToken: string) {
        return this.tokensRepository.findOne({ where: { refreshToken } })
    }

    async findById(id: string) {
        return this.tokensRepository.findOne({ where: { id } })
    }

    async removeById(id: string) {
        const token = await this.findById(id)
        return this.remove([token])
    }

    async remove(tokens: Token[]) {
        await this.tokensRepository.remove(tokens)
        return true
    }
}
