import { Field, InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@InputType()
export class SignUpInput {
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
