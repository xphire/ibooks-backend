import { FastifyInstance, RouteOptions, } from "fastify";
import { loginController, logOutController, validateTokenController } from "./auth.controller";
import { loginRequest } from "./auth.schema";


const loginRouteOptions : RouteOptions = {

      method : 'POST' as const,
      url : '/login',
      schema : {
         body : loginRequest
      },
      handler : loginController
}

const validateTokenRouteOptions : RouteOptions = {

    method : 'GET' as const,
    url : '/validate-token',
    handler : validateTokenController
}

const logoutRouteOptions : RouteOptions = {

    method : 'POST' as const,
    url : '/logout',
    handler : logOutController
}


export function authRoutes(app : FastifyInstance,_: unknown,done: () => void){

    app.route(loginRouteOptions)

    app.route(validateTokenRouteOptions)

    app.route(logoutRouteOptions)

    done()

}