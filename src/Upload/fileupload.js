import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
       
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const cloudinaryUpload = async (file) => {
    try {
        if (!file) {
            throw new Error("No file found");
        }
        const result = await cloudinary.uploader.upload(file,{
            resource_type: "auto",
        });
        console.log("file is uploaded successfully", result.url);
        return result;

    } catch (error) {
        fs.unlinkSync(file);
        console.log(error);
        return error;
    }
}

export {cloudinaryUpload};