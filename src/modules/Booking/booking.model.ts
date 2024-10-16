import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Hotel } from '../Hotel/hotel.model'
//import { User } from '../User/user.model'


export enum BookingStatus{
    // eslint-disable-next-line no-unused-vars
    PAID = 'paid',
    // eslint-disable-next-line no-unused-vars
    CANCELED = 'canceled',
    // eslint-disable-next-line no-unused-vars
    PLACED = 'placed'
}

@Entity()
export class Booking{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PLACED,
    })
    status: BookingStatus

    @Column({
        nullable : false
    })
    hotelId: number

    @Column({
        nullable : false
    })
    userId: number

    @Column('decimal',{
        nullable : false
    })
    totalAmount: number

    @Column({
        nullable : false
    })
    numberOfNights: number

    @Column({
        nullable : false
    })
    adultCount: number

    @Column({
        nullable : false
    })
    childCount: number

    @Column({
        nullable : false
    })
    firstName: string

    @Column({
        nullable : false
    })
    lastName: string

    @Column({
        nullable : true
    })
    checkInDate: string

    @Column({
        nullable : true
    })
    checkOutDate: string

    @Column({
        nullable : false
    })
    email: string

    @Column({
        nullable : true
    })
    lastUpdated: string

    @ManyToOne(() => Hotel,(hotel) => hotel.bookings)
    hotel : Hotel

}