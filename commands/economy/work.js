const userList = require("../../schemas/user");

module.exports = {
    name: "work",
    description: "Work to earn money",
    aliases: ["wk"],
    cooldown: 1800,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (userData.economy) {
            let earned = Math.round(Math.random() * (userData.jobinfo.salary)) + 100;
            userData.economy.wallet += earned;
            userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
            userData.level.xp += 5;
            userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
            if (!(Math.floor(userData.level.xp / 50) === (Math.floor((userData.level.xp - 5) / 50)))) {
                message.channel.send(`<@${userData.userId}>` + " just levelled up!")
            }
            message.channel.send("Congratulations! You earned " + earned + " gold as a " + userData.jobinfo.job + ". \nNow you have: " + userData.economy.wallet + "!");
        }
    }
}
