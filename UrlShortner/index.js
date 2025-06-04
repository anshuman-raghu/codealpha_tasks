import express from "express";
import urlRoute from "./routes/url.route.js";

import { connectToMongoDB } from "./connect.js";
import URL from "./model/url.model.js";

const app = express();

app.use(express.json());

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
    console.log("MongoDB Connected");
});
const PORT = 8003;

app.use("/url", urlRoute);

app.get("/:shortid", async (req, res) => {
    const entry = await URL.findOneAndUpdate(
        { shortId: req.params.shortid },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    console.log("her1");

    if (!entry) {
        return res.status(404).json({ message: "Short URL not found" });
    }

    console.log(entry.redirectUrl);
    console.log("her2");

    let finalRedirectUrl = entry.redirectUrl;
    if (
        !finalRedirectUrl.startsWith("http://") &&
        !finalRedirectUrl.startsWith("https://")
    ) {
        finalRedirectUrl = "https://" + finalRedirectUrl;
    }

    return res.redirect(finalRedirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
