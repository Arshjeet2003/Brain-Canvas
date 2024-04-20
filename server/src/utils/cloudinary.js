import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "dwxjmhke8",
  api_key: "715445534334748",
  api_secret: "aUs1h9Qn9fjermC22GoHGvIUDHw",
});

// function to upload file on cloudinary and delete (unlink) the locally temporarily stored file.
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary.
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file uploaded successfully
    console.log("File uploaded successfully : ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // remove the temporarily stored local file.
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
