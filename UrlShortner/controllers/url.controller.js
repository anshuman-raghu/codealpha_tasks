import { nanoid } from "nanoid";
import URL from "../model/url.model.js";

async function generateNewShortUrl(req, res) {
    const body = req.body;

    if (!body || !body.url) {
        return res.status(400).json({ error: "Url is Required" });
    }

    const shortID = nanoid(5);

    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
    });

    return res.status(200).json({ id: shortID });
}

async function getAnalytics(req, res) {
    const shortId = req.params.shortid;
    console.log(shortId);

    const result = await URL.findOne({ shortId });
    console.log(result);

    if (!result) {
        return res.status(404).json({ message: "Short URL not found" });
    }

    return res.status(201).json({
        totalCLick: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

export { generateNewShortUrl, getAnalytics };
