import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
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
        required: false,
    })
    readonly password: string
}
