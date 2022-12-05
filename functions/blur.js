const jimp = require("jimp");

module.exports = async (image, level) => {
    if (!image) throw new Error("You must provide an image as a first argument!");

    image = await jimp.read(image);

    image.blur(isNaN(level) ? 5 : parseInt(level));

    let raw;

    image.getBuffer("image/png", (err, buffer) => {
        raw = buffer;
    });                 

    return raw;
}