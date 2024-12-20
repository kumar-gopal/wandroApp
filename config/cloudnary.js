const cloudinary = require('cloudinary').v2;
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const uploadImageOnCloudinary =  async(localImagePath)=>{
    try {
        if(!localImagePath){
            return null;
        }
        // upload image on cloudinary
        const startTime = Date.now();
       const response = await cloudinary.uploader.upload(localImagePath,{
            resource_type:'image'
        })
        const endTime = Date.now();
        const uploadTime = endTime - startTime; 
        console.log(`Upload Time: ${uploadTime} ms`); // Log the upload time
        // file has been uploaded on cloudinary
        // console.log("file is uploaded on cloudinary",response);
        return response;
        
    } catch (error) {
        // remove the locally saved temporary file as upload operation got failed
        fs.unlinkSync(localImagePath);
        return null;
    }
}

module.exports = {
    uploadImageOnCloudinary
}
