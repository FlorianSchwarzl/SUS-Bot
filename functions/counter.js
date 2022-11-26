const fetchData = require("./fetchDataFromSave.js");

let current = fetchData.get("counter").current;
let lastUser = fetchData.get("counter").lastUser;
module.exports = (message) => {
    const counterChannel = fetchData.get("channels").counter;
    if (!(message.channel.id === counterChannel)) return false;
    if (message.content.toLowerCase() == current + 1 && message.author.id != lastUser) {
        current++;
        lastUser = message.author.id;
        fetchData.set("counter", { "current": current, "lastUser": lastUser });
        fetchData.write();
    }
    else message.delete().catch();
    return true;
}
