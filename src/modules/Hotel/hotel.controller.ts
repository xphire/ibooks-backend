import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource as dataSource } from "../../data-source";
import { createHotelRequest, HotelParam, HotelType, UpdateHotelRequest } from "./hotel.schema";
import { folder } from "./hotel.route";
import { MultipartFile } from "@fastify/multipart";
import {Hotel} from '../Hotel/hotel.model'
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";

//import { ZodError } from "zod";


export async function createHotelController (request : FastifyRequest, response : FastifyReply){


        //parse request

        const body = createHotelRequest.parse(request.body)

        //try catch-block not intentionally used so as to propagate error to default error handler


        const filePaths = request.files.map((file : MultipartFile) => {

            const path = folder + file.filename

            return path
        })


        const imageUrls = await uploadImageToCloud(filePaths)

        const hotel = new Hotel()

        hotel.userId = request.userId
        hotel.type = body.type
        hotel.starRating = body.starRating
        hotel.pricePerNight = body.pricePerNight
        hotel.name = body.name
        hotel.lastUpdated = new Date().toISOString()
        hotel.facilities = body.facilities
        hotel.description = body.description
        hotel.country = body.country
        hotel.city = body.city
        hotel.childCount = body.childCount
        hotel.adultCount = body.adultCount
        hotel.imageUrls = imageUrls

        const savedUser = await dataSource.manager.save(hotel)

        return response.status(201).send(savedUser)

}


export async function fetchUserHotels (request : FastifyRequest, response : FastifyReply){

    const hotels = await dataSource.manager.findBy(Hotel, {
          userId : request.userId
     })


     response.status(200).send(hotels)


} 

export async function fetchHotelById (request : FastifyRequest, response : FastifyReply){

    const {hotelId}  = request.params as HotelParam

    const hotel = await dataSource.manager.findOneBy(Hotel, {
        id : hotelId,
        userId : request.userId
    })

    // if(!hotel){
    //     return response.status(404).send({status : 'failed', message : 'cannot find hotel'})
    // }

    return response.status(200).send(hotel)
}

export async function updateHotel(request : FastifyRequest , response : FastifyReply){

    
    const {hotelId}  = request.params as HotelParam

    const hotel = await dataSource.manager.findOneBy(Hotel, {
        id : hotelId
    })

    
    if (!hotel){

        return response.status(404).send({status :'failed', message : 'cannot find hotel' })
    }

    const receivedHotel =  UpdateHotelRequest.parse(request.body) 
    
    const updatedHotel : HotelType = {

        ...receivedHotel,
        lastUpdated : '',
        userId : hotel.userId
    }

    const filePaths = request.files.map((file : MultipartFile) => {

        const path = folder + file.filename

        return path
    })

    const updatedImageUrls = await uploadImageToCloud(filePaths)


    updatedHotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

    updatedHotel.lastUpdated = new Date().toISOString();


    const savedHotel = await dataSource.manager.save(Hotel,{
        ...updatedHotel
    })

    return response.status(200).send(savedHotel)
}