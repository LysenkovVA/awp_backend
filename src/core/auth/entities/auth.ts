import { Field, ObjectType } from "@nestjs/graphql"
import { User } from "../../users/entities/user.entity"

/**
 * НЕ ЯВЛЯЕТСЯ СУЩНОСТЬЮ БД! ТОЛЬКО ОБЪЕКТ GRAPHQL!
 */
@ObjectType()
export class Auth {
    @Field({ nullable: true })
    user: User

    @Field({ nullable: true })
    accessToken: string

    @Field({ nullable: true })
    refreshToken: string
}
