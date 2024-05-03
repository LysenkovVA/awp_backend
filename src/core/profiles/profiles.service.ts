import { Injectable } from "@nestjs/common"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Profile } from "./entities/profile.entity"

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile)
        private profilesRepository: Repository<Profile>,
    ) {}

    async create(createProfileDto: CreateProfileDto) {
        return this.profilesRepository.create(createProfileDto)
    }
}
