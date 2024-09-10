import { readFile } from "fs/promises";
import jwt from "jsonwebtoken";

type jwtBody = {

    sub : number
    
}

export async function issueJWT (input : jwtBody) {


    const key = await readFile('./src/Keys/privateKey.pem')

    const token = jwt.sign(input,key, { algorithm: 'RS256', expiresIn : '1d' })

    return token 

}

export async function verifyJWT (token : string ) {

    const key = await readFile('./src/Keys/privateKey.pem')

    const decoded = jwt.verify(token,key)

    return decoded

}