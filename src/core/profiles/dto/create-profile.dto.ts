import { ApiProperty } from "@nestjs/swagger"

export class CreateProfileDto {
    @ApiProperty({
        example: "Иванов",
        description: "Фамилия",
        type: [String],
        required: false,
    })
    readonly firstName?: string

    @ApiProperty({
        example: "Иван",
        description: "Имя",
        type: [String],
        required: false,
    })
    readonly lastName?: string
}
