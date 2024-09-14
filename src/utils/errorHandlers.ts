import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"
import { MulterError } from "fastify-multer"


export class CustomizedError extends Error{

    message: string;
    statusCode : number

    constructor(message : string, statusCode : number){

        super()
        this.message = message
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }


}


export function parentErrorHandler(error : FastifyError, request: FastifyRequest,reply : FastifyReply){

     //zod-error : request body validation error
    if(error instanceof ZodError){

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



    //Custom Multer Errors
    if(error instanceof CustomizedError){

        return reply.status(error.statusCode)
        .send(
            {
                status : 'failed',
                message : error.message
            }

        )
    }


    //multer error
    if(error instanceof MulterError){

        return reply.status(400)
        .send(
            {
                status : 'failed',
                message : error.message
            }

        )
    }

    if (error.statusCode){

       return reply.status(error.statusCode).send({status: "failed", message: error.message})

    }

    return reply.status(500).send({status : "failed", message : "server error"})
}


export function onErrorHandler(request : FastifyRequest,reply : FastifyReply,error : FastifyError, done : () => void ){

    console.log(error)
    done()
}