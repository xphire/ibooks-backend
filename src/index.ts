import {createServer} from './app'
import config from 'config'
import process from 'process';
import cors from '@fastify/cors'
import * as Sentry from "@sentry/node";
import { AppDataSource } from './data-source';
import { parentErrorHandler, onErrorHandler } from './utils/errorHandlers';
import { userRoutes } from './modules/User/user.route';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import { authRoutes } from './Auth/auth.route';

async function start(){


     try {

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

    
        //health route

        fastify.get('/api/v1/health', function (_,reply){

             return reply.status(200).send("OK")
        })

        //user routes
        fastify.withTypeProvider<ZodTypeProvider>().register(userRoutes, {
            prefix : 'api/v1/users'
        })

        //login/auth route
        fastify.withTypeProvider<ZodTypeProvider>().register(authRoutes, {
            prefix : 'api/v1/auth'
        })
        
        Sentry.setupFastifyErrorHandler(fastify);

        //log errors on error
        fastify.addHook('onError', onErrorHandler)

        //parent error handler
        fastify.setErrorHandler(parentErrorHandler)

        await fastify.listen({port})

        console.log({
            message : `APP is listening on PORT : ${port}`,
            time: new Date().toLocaleString()
        })

     } catch (error) {

        console.error(error)
        process.exit(1)
        
     }

}



start()