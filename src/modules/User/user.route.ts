import { FastifyInstance, RouteOptions, } from "fastify";
import { createUserController, fetchUser } from "./user.controller";
import { createUserRequest,createUserResponse } from "./user.schema";
import { userAuthController } from "../../Auth/auth.controller";


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


const fetchUserByIdRouteOptions : RouteOptions = {

      method : 'GET',
      url : '/user',
      onRequest : userAuthController,
      handler : fetchUser
}


export function userRoutes(app : FastifyInstance,_: unknown,done: () => void){

    app.route(createUserRouteOptions)

    app.route(fetchUserByIdRouteOptions)

    done()

}