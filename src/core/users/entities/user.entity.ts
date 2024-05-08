import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import * as bcrypt from "bcryptjs"
import { Profile } from "../../profiles/entities/profile.entity"
import { Token } from "../../tokens/entities/token.entity"

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => ID)
    id: string

    @Column()
    @Field()
    login: string

    @Column()
    @Field()
    password: string

    @OneToOne(() => Profile, { onDelete: "CASCADE" })
    @JoinColumn()
    @Field(() => Profile)
    profile: Promise<Profile>

    @OneToMany(() => Token, (token) => token.user, { onDelete: "CASCADE" })
    @Field(() => [Token], { nullable: "itemsAndList" })
    tokens: Promise<Token[]>

    @BeforeInsert()
    async encryptPassword() {
        this.password = await bcrypt.hash(this.password, 5)
    }
}
