import { CreateTokenInput } from "./create-token.input"
import { Field, InputType, PartialType } from "@nestjs/graphql"

@InputType()
export class UpdateTokenInput extends PartialType(CreateTokenInput) {
    @Field()
    id: string
}
