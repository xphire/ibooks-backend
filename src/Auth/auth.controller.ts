import bcrypt from 'bcryptjs'
import * as LoginSchema from './auth.schema'
import { FastifyReply, FastifyRequest, } from "fastify";
import { AppDataSource as dataSource } from "../data-source";
import { User } from '../modules/User/user.model';
import { issueJWT, verifyJWT } from './auth';



declare module 'fastify'{
    interface FastifyRequest{
        userId : number
    }
}


export async function loginController(request : FastifyRequest, response : FastifyReply){

     try {

        const {email,password} = request.body as LoginSchema.loginRequestSchema

        const user = await dataSource.manager.findOneBy(User, {
            email 
        });

        if(!user){
            return response.status(401).send({status: "failed",message : "invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return response.status(401).send({status: "failed",message : "invalid credentials"})
        }

        const id = user.id

        const token = await issueJWT({sub : id })

        response.setCookie("auth_token",token)

        return response.status(201).send({userId : id })
 
     } catch (error) {

        throw new Error(error as string)
        
     }
}


export async function validateTokenController(request : FastifyRequest, response : FastifyReply){

    const token = request.cookies.auth_token

    if (!token) return response.status(401).send({status : 'failed', message : 'unauthorized'})

    try {
      
        const decoded =  await verifyJWT(token)

        request.userId = decoded.sub as unknown as number

        response.status(200).send({userId : request.userId})

        
    } catch (error) {
        
        console.log(error)
        return response.status(401).send({status : 'failed', message : 'unathenticated'})
    }

}


export async function logOutController(request : FastifyRequest, response: FastifyReply){

    response.cookie('auth_token','',{
        expires: new Date(0), 
    })

    response.status(201).send()
}