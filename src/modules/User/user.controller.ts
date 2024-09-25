///* eslint-disable no-useless-catch */

import bcrypt from 'bcryptjs'
import * as UserSchema from '../User/user.schema'
import { FastifyReply, FastifyRequest, } from "fastify";
import { AppDataSource as dataSource } from "../../data-source";
import { User } from "./user.model";
import { issueJWT } from '../../Auth/auth';
//import { issueJWT } from '../../Auth/auth';


//// eslint-disable-next-line @typescript-eslint/no-explicit-any
//{Body : UserSchema.createUserRequestSchema}
export async function createUserController(request : FastifyRequest, 
response : FastifyReply){


        const body  = request.body as UserSchema.createUserRequestSchema;

        const existingUser = await dataSource.manager.findOneBy(User, {
            email : body.email
        });

        if (existingUser) return response.status(409).send({status: "failed", message : "user already exists"}); 

        const encryptedPassword = await bcrypt.hash(body.password,8);

        const user = new User()

        user.email = body.email
        user.firstName = body.firstName
        user.lastName = body.lastName
        user.password = encryptedPassword

        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const {password, ...rest} = await dataSource.manager.save(user)

        const token = await issueJWT({sub : rest.id })

        //response.header('auth-cookie',)

        response.setCookie('auth_token',token,{
            domain: '.localhost'
        })

        return response.status(201).send(rest)


    


}