import ConnectDB from "./db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./.env" });

ConnectDB()
    .then(() => {
        app.on("Error", (error) => {
            console.error("error");
        });
        const port = process.env.port || 8000;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Mongodb Connection Failed", error);
    });
