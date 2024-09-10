import Fastify, { FastifyInstance } from 'fastify'

export async function createServer(opts={}) : Promise<FastifyInstance>{


    const server : FastifyInstance = Fastify(opts)


    return server

 
}