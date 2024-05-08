import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { ProfilesService } from "./profiles.service"
import { Profile } from "./entities/profile.entity"
import { CreateProfileInput } from "./dto/create-profile.input"

@Resolver(() => Profile)
export class ProfilesResolver {
    constructor(private readonly profilesService: ProfilesService) {}

    @Mutation(() => Profile)
    async createProfile(
        @Args("createProfileInput") createProfileInput: CreateProfileInput,
    ) {
        return await this.profilesService.create(createProfileInput)
    }
}
