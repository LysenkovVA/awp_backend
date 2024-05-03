import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import { Token } from "../../tokens/entities/token.entity"
import { Profile } from "../../profiles/entities/profile.entity"
import * as bcrypt from "bcryptjs"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    login: string

    @Column()
    password: string

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Promise<Profile>

    @OneToMany(() => Token, (token) => token.user)
    tokens: Promise<Token[]>

    @BeforeInsert()
    async encryptPassword() {
        this.password = await bcrypt.hash(this.password, 5)
    }
}
