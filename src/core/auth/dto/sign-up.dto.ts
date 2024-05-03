import { ApiProperty } from "@nestjs/swagger"

export class SignUpDto {
    @ApiProperty({
        example: "user",
        description: "Логин",
        type: [String],
        required: true,
    })
    readonly login: string

    @ApiProperty({
        example: "123456",
        description: "Пароль",
        type: [String],
        required: true,
    })
    readonly password: string
}
