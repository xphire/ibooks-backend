import { FastifyInstance, RouteOptions } from "fastify";
import { createHotelController, fetchUserHotels , fetchHotelById, updateHotel, searchHotels, fetchAllHotels } from "./hotel.controller";
import { userAuthController } from "../../Auth/auth.controller";
import multer from 'fastify-multer'
import { randomUUID as uuid } from "crypto";
import { CustomizedError } from "../../utils/errorHandlers";
import fs from 'node:fs/promises'
import { MultipartFile } from "@fastify/multipart";
//import { createHotelRequest, createHotelRequestSchema } from "./hotel.schema";

export const folder = './src/uploads/hotels/'
const storage = multer.diskStorage({
    destination: function (request , file , cb){
        cb(null, folder)
    },
    filename: function (request, file, cb){

        const name = uuid() + '-' + file.originalname

        cb(null, name)
    }
})


const upload = multer({
    storage : storage, 
    limits : {
        fileSize : 5 * 1024 * 1024, //this is 5MB
        fields : 20

    },
    fileFilter : function(request, file, cb){

        const allowableMimes = ['png', 'jpg', 'jpeg']

        const mimeStrip = file.mimetype.split('/')[1]


        if(!allowableMimes.includes(mimeStrip)){

            cb(new CustomizedError(`${mimeStrip} files not accepted`,400))

        }
        else{

              cb(null,true)
        }
       
    }
})


const createHotelRouteOptions : RouteOptions = {

    method : 'POST',
    url : '/hotel',
    onRequest : userAuthController,
    preHandler : upload.array('imageFiles',6),
    handler : createHotelController,
    onResponse : async function(request){

        const files = request.files

        if (files.length > 0){

            const toUnlink =  files.map(async (file : MultipartFile) => {

                const path = folder + file.filename;

                await fs.unlink(path)

                return
            })

            await Promise.all(toUnlink)
        }


    }

}


const fetchUserHotelsRouteOptions : RouteOptions = {

    method : 'GET',
    url : '/user_hotels',
    onRequest : userAuthController,
    handler : fetchUserHotels,

}


const fetchHotelByIdRouteOptions : RouteOptions = {

    method : 'GET',
    url : '/hotel/:hotelId',
    //onRequest : userAuthController,
    handler : fetchHotelById
}


const updateHotelRouteOptions : RouteOptions = {

    method : 'PUT',
    url : '/hotel/:hotelId',
    onRequest : userAuthController,
    preHandler : upload.array('imageFiles',6),
    handler : updateHotel,
    onResponse : async function(request){

        const files = request.files

        if (files.length > 0){

            const toUnlink =  files.map(async (file : MultipartFile) => {

                const path = folder + file.filename;

                await fs.unlink(path)

                return
            })

            await Promise.all(toUnlink)
        }


    }


}


const searchHotelsRouteOptions : RouteOptions = {


    method : 'GET',
    url : '/search',
    handler : searchHotels


}


const fetchAllHotelsRouteOptions : RouteOptions = {


    method : 'GET',
    url : '/all',
    handler : fetchAllHotels


}


export function hotelRoutes(app : FastifyInstance,_: unknown,done: () => void){


    app.register(multer.contentParser)

    app.route(createHotelRouteOptions)

    app.route(fetchUserHotelsRouteOptions)

    app.route(fetchHotelByIdRouteOptions)

    app.route(updateHotelRouteOptions)

    app.route(searchHotelsRouteOptions)

    app.route(fetchAllHotelsRouteOptions)

    done()
}