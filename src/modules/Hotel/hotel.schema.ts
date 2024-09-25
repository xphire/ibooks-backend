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
    pricePerNight : number({
        coerce : true
    }),
    starRating : number({
       coerce : true
    }).min(1).max(5)


}).strict()


export type createHotelRequestSchema = TypeOf<typeof createHotelRequest>

export type HotelParam = {
    hotelId : number
}


export const UpdateHotelRequest = object({

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
    pricePerNight : number({
        coerce : true
    }),
    starRating : number({
       coerce : true
    }).min(1).max(5),
    id : number({
        coerce : true
    }),
    imageUrls: array(string())

}).strict()


export type HotelType = TypeOf<typeof UpdateHotelRequest> & {

    userId : number;
    lastUpdated : string
   
}