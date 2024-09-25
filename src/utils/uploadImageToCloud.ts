import fs from 'node:fs';
import {v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'


export async function uploadImageToCloud(filePaths : string[]) : Promise<string[]>{

    return  await Promise.all(filePaths.map(async (path) => {

        const reader =  fs.readFileSync(path)

        const uploadResponse : UploadApiResponse   =  await new Promise((resolve) => {

            cloudinary.uploader.upload_stream((error : UploadApiErrorResponse,uploadResult : UploadApiResponse) => {

                return resolve(uploadResult)

            }).end(reader)
        })

        return uploadResponse.secure_url

    }) ) 


}
