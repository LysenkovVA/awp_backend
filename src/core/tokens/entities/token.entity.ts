import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity()
export class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: true })
    fingerPrint: string

    @Column({ type: "text", nullable: false })
    refreshToken: string

    @ManyToOne(() => User, (user) => user.tokens)
    user: User
}
