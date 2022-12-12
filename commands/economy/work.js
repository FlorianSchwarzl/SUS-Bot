const userList = require("../../schemas/user");
module.exports = {
    name: "work",
    description: "Work to earn money",
    aliases: ["wk"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        let earned = Math.round(Math.random() * 400) + 100;
        userData.economy.wallet += earned;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
        message.channel.send("Congratulations! You earned " + earned + " gold. \nNow you have: " + userData.economy.wallet + "!");

    }

}