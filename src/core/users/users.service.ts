import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { Repository } from "typeorm"
import { UserDto } from "./dto/user.dto"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findByLogin(login: string) {
        return this.usersRepository.findOne({
            where: { login },
        })
    }

    async create(userDto: UserDto) {
        return this.usersRepository.create(userDto)
    }
}
