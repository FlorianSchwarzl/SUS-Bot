const { goodbyeMessages, goodbyeChannel } = require("../config");
const { createCanvas, loadImage } = require("canvas")

module.exports = async (client, member) => {
    const channel = client.channels.cache.get(goodbyeChannel);

    const canvas = createCanvas();

    channel.send("temp");
}