const userList = require("../../schemas/user.js");
const { Random } = require("sussy-util");

module.exports = {
    name: "search",
    cooldown: 60,
    async run(client, interaction, args, guildData, userData) {
        const amount = Random.randomInt(900, 1600);
        const current = userData.economy;
        current.wallet += amount;
        userList.findByIdAndUpdate(userData._id, { economy: current }, (err, data) => { });
        userData.level.xp += 2;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
        return { content: `You found ${amount} gold in the ${args[0]}.`, disableOriginal: true, success: ["command:search", this] };
    }
}