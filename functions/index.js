const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// CORS-ni yoqish
app.use(cors({ origin: true }));

// /api/apps endpointi (script.js bilan moslash uchun)
app.get("/api/apps", (req, res) => {
    try {
        const filePath = path.join(__dirname, "../public/data/apps.json");
        if (!fs.existsSync(filePath)) {
            throw new Error("apps.json fayli topilmadi");
        }
        const appsData = fs.readFileSync(filePath);
        res.json(JSON.parse(appsData));
    } catch (error) {
        console.error("apps.json o‘qishda xato:", error.message);
        res.status(500).json({ error: "apps.json faylini o‘qishda xato yuz berdi" });
    }
});

exports.api = functions.https.onRequest(app);