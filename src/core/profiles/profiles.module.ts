import { Module } from "@nestjs/common"
import { ProfilesService } from "./profiles.service"
import { ProfilesResolver } from "./profiles.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Profile } from "./entities/profile.entity"

@Module({
    providers: [ProfilesResolver, ProfilesService],
    exports: [ProfilesService],
    imports: [TypeOrmModule.forFeature([Profile])],
})
export class ProfilesModule {}
