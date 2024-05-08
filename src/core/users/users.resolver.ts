import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { User } from "./entities/user.entity"
import { CreateUserInput } from "./dto/create-user.input"

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => User, { name: "findByLogin" })
    async findByLogin(@Args("login") login: string) {
        return await this.usersService.findByLogin(login)
    }

    @Query(() => User, { name: "findByLogin" })
    async findBy(@Args("createUserInput") createUserInput: CreateUserInput) {
        return await this.usersService.findByLogin(createUserInput.login)
    }

    @Mutation(() => User)
    async createUser(
        @Args("createUserInput") createUserInput: CreateUserInput,
    ) {
        return this.usersService.create(createUserInput)
    }

    @Query(() => [User], { name: "findAllUsers" })
    async findAllUsers() {
        return await this.usersService.findAll()
    }

    // @Query(() => [User], { name: 'users' })
    // findAll() {
    //   return this.usersService.findAll();
    // }
    //
    // @Query(() => User, { name: 'user' })
    // findOne(@Args('id', { type: () => Int }) id: number) {
    //   return this.usersService.findOne(id);
    // }
    //
    // @Mutation(() => User)
    // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    //   return this.usersService.update(updateUserInput.id, updateUserInput);
    // }
    //
    // @Mutation(() => User)
    // removeUser(@Args('id', { type: () => Int }) id: number) {
    //   return this.usersService.remove(id);
    // }
}
