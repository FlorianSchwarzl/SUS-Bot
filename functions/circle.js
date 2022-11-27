const jimp = require('jimp');

module.exports = async (image) => {
    if (!image) throw new Error(`You must provide an image as a first argument.`);
    image = await jimp.read(image);

    image.resize(480, 480);
    image.circle();

    let raw;
    image.getBuffer(`image/png`, (err, buffer) => {
        raw = buffer;
    });

    return raw;
}