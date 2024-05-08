import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity()
@ObjectType()
export class Token {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => ID)
    id: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    fingerPrint: string

    @Column({ type: "text" })
    @Field()
    refreshToken: string

    @ManyToOne(() => User, (user) => user.tokens)
    @Field(() => User)
    user: Promise<User>
}
