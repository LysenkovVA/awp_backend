import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { SignUpInput } from "./dto/sign-up.input"
import { Auth } from "./entities/auth"
import { SignInInput } from "./dto/sign-in.dto"

@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Auth)
    async signUp(@Args("signUpInput") signUpInput: SignUpInput) {
        return await this.authService.signUp(signUpInput)
    }

    @Mutation(() => Auth)
    async signIn(@Args("signInInput") signInInput: SignInInput) {
        return await this.authService.signIn(signInInput)
    }

    @Mutation(() => Auth)
    async logout(@Args("refreshToken") refreshToken: string) {
        return await this.authService.logout(refreshToken)
    }

    @Mutation(() => Auth)
    async refreshAccessToken(@Args("refreshToken") refreshToken: string) {
        return await this.authService.refreshAccessToken(refreshToken)
    }
}
