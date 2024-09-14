import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm"

@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable : false
    })
    email: string

    @Column({
        nullable : false
    })
    password: string

    @Column({
        nullable : false
    })
    firstName: string

    @Column({
        nullable : false
    })
    lastName: string
}