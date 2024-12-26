const cloudinary = require('cloudinary').v2;
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


// Set the size limit in bytes (e.g., 2MB = 2 * 1024 * 1024)
const SIZE_LIMIT = 2 * 1024 * 1024;

const uploadImageOnCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) {
      return null;
    }

    // Check the file size
    const stats = fs.statSync(localImagePath);
    const fileSize = stats.size; // File size in bytes

    if (fileSize > SIZE_LIMIT) {
      console.log("File size exceeds the limit of 2MB");
      fs.unlinkSync(localImagePath); // Remove the local file
      return { error: "File size exceeds the allowed limit of 2MB." };
    }

    // Upload image on Cloudinary
    const startTime = Date.now();
    const response = await cloudinary.uploader.upload(localImagePath, {
      resource_type: "image",
    });
    const endTime = Date.now();

    const uploadTime =endTime - startTime;
    console.log(`Upload Time: ${uploadTime} ms`); // Log the upload time

    // File has been uploaded successfully to Cloudinary
    return response;
  } catch (error) {
    console.error("Error during upload:", error);

    // Remove the local file in case of upload failure
    if (fs.existsSync(localImagePath)) {
      fs.unlinkSync(localImagePath);
    }
    return null;
  }
};


module.exports = {
    uploadImageOnCloudinary
}
