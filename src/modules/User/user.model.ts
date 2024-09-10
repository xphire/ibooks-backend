import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm"

@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string
}