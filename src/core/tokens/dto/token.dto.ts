import { ApiProperty } from "@nestjs/swagger"

export class TokenDto {
    @ApiProperty({
        example:
            "ASDJFADSJF;ADSJFDASKJF;KDASJFL;KJADSKFJKADSJFKADJSFJKHADSKJFHADSKFJ",
        description: "Refresh token",
        type: [String],
        required: true,
    })
    readonly refreshToken: string
}
