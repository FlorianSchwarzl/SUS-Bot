const userList = require("../../schemas/user");
const talkedRecently = new Set();
module.exports = {
    name: "work",
    description: "Work to earn money",
    aliases: ["wk"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 30 minutes before working again");
        }
        else { 
        if (userData.economy) {
        talkedRecently.add(message.author.id);
        let earned = Math.round(Math.random() * 400) + 100;
        userData.economy.wallet += earned;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
        userData.level.xp += 5;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
        if(!(Math.floor(userData.level.xp / 50) === (Math.floor((userData.level.xp-5)/50)))) {
            message.channel.send(`<@${userData.userId}>` + " just levelled up!")
        }
        message.channel.send("Congratulations! You earned " + earned + " gold. \nNow you have: " + userData.economy.wallet + "!");

        setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, 1800000);
        }
        }
    }

}