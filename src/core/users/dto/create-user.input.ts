import { Field, InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@InputType()
export class CreateUserInput {
    @ApiProperty({
        example: "user",
        description: "Логин",
        type: [String],
        required: true,
    })
    @Field()
    readonly login: string

    @ApiProperty({
        example: "123456",
        description: "Пароль",
        type: [String],
        required: false,
    })
    @Field()
    readonly password: string
}
