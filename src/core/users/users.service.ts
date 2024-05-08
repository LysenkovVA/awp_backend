import { Injectable } from "@nestjs/common"
import { CreateUserInput } from "./dto/create-user.input"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { Repository } from "typeorm"

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

    async create(createUserInput: CreateUserInput) {
        return this.usersRepository.create(createUserInput)
    }

    async findAll() {
        return this.usersRepository.find()
    }
}
