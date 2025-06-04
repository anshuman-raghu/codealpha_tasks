import express from "express";
import cookieParser from "cookie-parser";
import cros from "cors";
import multer from "multer";

const app = express();

app.use(
    cros({
        origin: process.env.CROS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

const upload = multer();

export default app;
