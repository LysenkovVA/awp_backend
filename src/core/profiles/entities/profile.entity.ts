import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string
}
