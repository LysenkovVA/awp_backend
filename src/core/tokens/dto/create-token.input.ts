import { Field, InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@InputType()
export class CreateTokenInput {
    @ApiProperty({
        example: "SomeFingerPrint",
        description: "Fingerprint устройства",
        type: [String],
        required: false,
    })
    @Field({ nullable: true })
    readonly fingerPrint: string

    @ApiProperty({
        example: "DHFLADHFADJHDSJKHGKADSLFDASKJHFLAHDS",
        description: "Refresh token",
        type: [String],
        required: false,
    })
    @Field()
    readonly refreshToken: string
}
