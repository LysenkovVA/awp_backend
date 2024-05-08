import { Injectable } from "@nestjs/common"
import { CreateProfileInput } from "./dto/create-profile.input"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Profile } from "./entities/profile.entity"

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile)
        private profilesRepository: Repository<Profile>,
    ) {}

    async create(createProfileInput: CreateProfileInput) {
        return this.profilesRepository.create(createProfileInput)
    }
}
