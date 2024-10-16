import {number, object, string, TypeOf} from 'zod'


export const createBookingSession = object({

    hotelId : number({
        coerce : true
    }),
    adultCount : number(),
    childCount : number(),
    checkInDate : string().datetime(),
    checkOutDate : string().datetime(),
    numberOfNights : number()

}).strict()


export type CreateBookingSessionType = TypeOf<typeof createBookingSession>