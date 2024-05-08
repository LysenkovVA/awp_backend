import { ApiProperty } from "@nestjs/swagger"
import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class SignInInput {
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
        required: true,
    })
    @Field()
    readonly password: string
}
