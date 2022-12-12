const userList = require("../../schemas/user");
module.exports = {
    name: "resetbalance",
    description: "Clear your profile",
    aliases: ["cls"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        userData.economy.wallet = 0;
        userData.economy.bank = 0;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
        message.channel.send("Congratulations! Your profile was cleared!");
    }

}