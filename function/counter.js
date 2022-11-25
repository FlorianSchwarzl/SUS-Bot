const JSON = require("./fetchDataFromSave.js");

let current = JSON.get("counter").current;
let lastUser = JSON.get("counter").lastUser;
module.exports = (message, channelId) => {
    if (!(message.channel.id === channelId)) return false;
    if (message.content.toLowerCase() == current + 1 && message.author.id != lastUser) {
        current++;
        lastUser = message.author.id;
        JSON.set("counter", { "current": current, "lastUser": lastUser });
        JSON.write();
    }
    else message.delete();
    return true;
}
