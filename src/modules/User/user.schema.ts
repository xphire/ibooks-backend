import {number, object, string, TypeOf} from 'zod'


export const createUserRequest = object({

    email : string().email(),
    password : string().min(6),
    firstName : string(),
    lastName : string()
    
}).strict()

export const createUserResponse = object({
      
     id : number(),
     email : string().email(),
     firstName : string(),
     lastName : string()
}).strict()



export type createUserRequestSchema = TypeOf<typeof createUserRequest>

export  type createUserResponseSchema = TypeOf<typeof createUserResponse>