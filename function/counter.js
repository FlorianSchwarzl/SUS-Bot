const JSON = require("./fetchDataFromSave.js");

let current = JSON.get("counter");
module.exports = (message, channelId) => {
    if (!(message.channel.id === channelId)) return false;
    if (message.content.toLowerCase() == current + 1) {
        current++;
        JSON.set("counter", current);
        JSON.write();
    }
    else message.delete();
    return true;
}
