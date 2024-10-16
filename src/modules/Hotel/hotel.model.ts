import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Booking } from "../Booking/booking.model";
//import { Booking } from "../Booking/booking.model"

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable : false
    })
    userId: number

    @Column({
        nullable : false
    })
    name: string

    @Column({
        nullable : false
    })
    city: string

    @Column({
        nullable : false
    })
    country: string

    @Column({
        nullable : false
    })
    description: string

    @Column({
        nullable : false
    })
    type: string

    @Column({
        nullable : false
    })
    adultCount: number

    @Column({
        nullable : false
    })
    childCount: number

    @Column("text",{
        nullable : false,
        array : true
    })
    facilities: string[]

    @Column("decimal",{
        nullable : false
    })
    pricePerNight: number

    @Column({
        nullable : false
    })
    starRating: number

    @Column("text",{
        nullable : false,
        array : true
    })
    imageUrls: string[]

    @Column({
        nullable : false
    })
    lastUpdated: string

    @OneToMany(() => Booking, (booking) => booking.hotel)
    bookings : Booking[]
}