import { Field, InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@InputType()
export class CreateProfileInput {
    @ApiProperty({
        example: "Ivanov",
        description: "Фамилия",
        type: [String],
        required: false,
    })
    @Field({ nullable: true })
    readonly firstName: string

    @ApiProperty({
        example: "Ivan",
        description: "Имя",
        type: [String],
        required: false,
    })
    @Field({ nullable: true })
    readonly lastName: string
}
