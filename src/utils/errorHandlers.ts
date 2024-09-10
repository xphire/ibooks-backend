import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"

export function parentErrorHandler(error : FastifyError, request: FastifyRequest,reply : FastifyReply){

    if (error.statusCode){

       //zod-error : request validation error

       if(error.statusCode === 400 && error instanceof ZodError){

           return reply.status(400).send({
               status : "failed",
               message : error.issues.map((err) => (
                   {
                       error : err.message,
                       field : err.path
                   }
               ))
           })
       }
       
       return reply.status(error.statusCode).send({status: "failed", message: error.message})
    }

    return reply.status(500).send({status : "failed", message : "server error"})
}


export function onErrorHandler(request : FastifyRequest,reply : FastifyReply,error : FastifyError, done : () => void ){

    console.log(error)
    done()
}