import { FastifyReply, FastifyRequest } from "fastify";
import {v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'
import { AppDataSource as dataSource } from "../../data-source";
import { createHotelRequest } from "./hotel.schema";
import { folder } from "./hotel.route";
import fs from 'node:fs'
import { MultipartFile } from "@fastify/multipart";
import {Hotel} from '../Hotel/hotel.model'
//import { ZodError } from "zod";


export async function createHotelController (request : FastifyRequest, response : FastifyReply){


        //parse request

        const body = createHotelRequest.parse(request.body)

        //try catch-block not intentionally used so as to propagate error to default error handler


        const filePaths = request.files.map((file : MultipartFile) => {

            const path = folder + file.filename

            return path
        })

        const imageUrls = await Promise.all(filePaths.map(async (path) => {

            const reader =  fs.readFileSync(path)

            const uploadResponse : UploadApiResponse   =  await new Promise((resolve) => {

                cloudinary.uploader.upload_stream((error : UploadApiErrorResponse,uploadResult : UploadApiResponse) => {

                    return resolve(uploadResult)

                }).end(reader)
            })

            return uploadResponse.secure_url

        }) ) 

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

        return response.status(200).send(savedUser)

}