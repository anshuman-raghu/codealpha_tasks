import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const UploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            error(`Error while fatching locaFilePath in UploadOnCloudinary`);
            return null;
        }

        const responce = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath);
        return responce;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error in File Uploading", error);
        return null;
    }
};

const DeleteOnCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        error("Error while deleting file on CLoudinary", error);
    }
};

export { UploadOnCloudinary, DeleteOnCloudinary };
