import mongoose from "mongoose";

async function connectToMongoDB(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export { connectToMongoDB };
