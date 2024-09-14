import {array, number, object, string, TypeOf} from 'zod'

export const createHotelRequest = object({

    name : string(),
    city : string(),
    country : string(),
    description : string(),
    type : string(),
    adultCount : number({
        coerce : true
    }),
    childCount : number({
        coerce : true
    }),
    facilities  : array(string()),
    imageUrls  : array(string()),
    pricePerNight : number({
        coerce : true
    }),
    starRating : number({
       coerce : true
    }).min(1).max(5),
    lastUpdated: string().datetime()


}).strict()


export type createHotelRequestSchema = TypeOf<typeof createHotelRequest>