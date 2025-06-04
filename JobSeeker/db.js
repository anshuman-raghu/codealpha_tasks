import mongoose from "mongoose";
import dotevn from "dotenv";

const DB_NAME = process.env.DB_NAME;

const ConnectDB = async () => {
    try {
        const ConectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `\n Mongodb Connected !!! DB HOST: ${ConectionInstance.Connection.host}`
        );
    } catch (error) {
        console.error("Error", error);
        process.exit(1);
    }
};

export default ConnectDB;
