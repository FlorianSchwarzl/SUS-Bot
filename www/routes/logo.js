const { loadImage, createCanvas } = require("canvas");
const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res) => {
    const image = await loadImage(path.resolve(__dirname, "../assets/SUS-Bot-logos_white.png"));
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    res.send(canvas.toDataURL());
});

module.exports = router;