import { object, string, TypeOf} from 'zod'


export const loginRequest = object({

    email : string().email(),
    password : string()
    
}).strict()


export type loginRequestSchema = TypeOf<typeof loginRequest>