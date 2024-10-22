import {createServer} from './app'
import config from 'config'
import process from 'process';
import cors from '@fastify/cors'
import * as Sentry from "@sentry/node";
import {v2 as cloudinary} from 'cloudinary';
import { AppDataSource } from './data-source';
import { parentErrorHandler, onErrorHandler } from './utils/errorHandlers';
import { userRoutes } from './modules/User/user.route';
import { authRoutes } from './Auth/auth.route';
import { hotelRoutes } from './modules/Hotel/hotel.route';
import { bookingRoutes } from './modules/Booking/booking.route';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cookie, { FastifyCookieOptions } from '@fastify/cookie'

cloudinary.config({
    cloud_name : config.get('cloudinary_cloud_name'),
    api_key : config.get('cloudinary_api_key'),
    api_secret : config.get('cloudinary_api_secret')

})

async function start(){

     try {

        console.time('boot-time')

        const fastify = await createServer({
            logger : false
        });


        await fastify.register(cors, {
            origin : config.get('frontend_url'),
            credentials : true,
            
        })

        fastify.setValidatorCompiler(validatorCompiler)
        fastify.setSerializerCompiler((serializerCompiler))

        fastify.register(cookie,{

            secret : config.get('cookie_secret'),
            parseOptions : {
               httpOnly: true,
               maxAge : 86400000,
               path : '/'
               
            }

        } as FastifyCookieOptions)


        const port = config.get("port") as number || 9000

        await AppDataSource.initialize()

        // console.log(process.env['NODE_ENV'])

        // console.log(config.get('database_host'))

    
        //health route

        fastify.get('/api/v1/health', function (_,reply){

             return reply.status(200).send("OK")
        })


        //login/auth routes
        fastify.withTypeProvider<ZodTypeProvider>().register(authRoutes, {
            prefix : 'api/v1/auth'
        })

        //user routes
         fastify.withTypeProvider<ZodTypeProvider>().register(userRoutes, {
            prefix : 'api/v1/users'
        })
        
        //hotel routes
        fastify.withTypeProvider<ZodTypeProvider>().register(hotelRoutes, {
            prefix : 'api/v1/hotels'
        })

        //booking routes
        fastify.withTypeProvider<ZodTypeProvider>().register(bookingRoutes, {
            prefix : 'api/v1/bookings'
        })

        Sentry.setupFastifyErrorHandler(fastify);

        //log errors on error
        fastify.addHook('onError', onErrorHandler)

        //parent error handler
        fastify.setErrorHandler(parentErrorHandler)

        await fastify.listen({port})

        console.log({
            message : `APP is listening on PORT : ${port}`,
            time: new Date().toLocaleString(),
            env : process.env['NODE_env']
        })

        console.timeEnd('boot-time')

     } catch (error) {

        console.error(error)
        process.exit(1)
        
     }

}



start()