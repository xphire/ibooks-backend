import Fastify, { FastifyInstance } from 'fastify'

declare module 'fastify'{
    interface FastifyRequest{
        userId : number,
        files : [],
        filePaths : string[]
    }
}

export async function createServer(opts={}) : Promise<FastifyInstance>{


    const server : FastifyInstance = Fastify(opts)


    return server

 
}