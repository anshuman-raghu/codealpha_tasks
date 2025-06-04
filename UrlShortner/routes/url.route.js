import express from "express";
import {
    generateNewShortUrl,
    getAnalytics,
} from "../controllers/url.controller.js";
const router = express.Router();

router.post("/", generateNewShortUrl);
router.get("/analytics/:shortid", getAnalytics);
 
export default router;
