import { FastifyInstance, RouteOptions, } from "fastify";
import { createUserController } from "./user.controller";
import { createUserRequest,createUserResponse } from "./user.schema";


const createUserRouteOptions : RouteOptions = {

      method : 'POST' as const,
      url : '/register',
      schema : {
         body : createUserRequest,
         response : {
            
            201 : createUserResponse}
      },
      handler : createUserController
}


export function userRoutes(app : FastifyInstance,_: unknown,done: () => void){

    app.route(createUserRouteOptions)

    done()

}