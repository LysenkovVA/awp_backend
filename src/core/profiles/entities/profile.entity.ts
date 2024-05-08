import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
@ObjectType()
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => ID)
    id: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    lastName: string
}
