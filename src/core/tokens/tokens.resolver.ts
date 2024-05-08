import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { TokensService } from "./tokens.service"
import { Token } from "./entities/token.entity"
import { CreateTokenInput } from "./dto/create-token.input"

@Resolver(() => Token)
export class TokensResolver {
    constructor(private readonly tokensService: TokensService) {}

    @Mutation(() => Token)
    async createToken(
        @Args("createTokenInput") createTokenInput: CreateTokenInput,
    ) {
        return await this.tokensService.create(createTokenInput)
    }

    @Mutation(() => Token)
    removeTokenById(@Args("id") id: string) {
        return this.tokensService.removeById(id)
    }
}
