const userList = require("../../schemas/user");
module.exports = {
    name: "resetxp",
    description: "Clear your profile",
    aliases: ["resetlevels"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        userData.levels.xp = 0;
        userList.findByIdAndUpdate(userData._id, { levels: userData.levels }, (err, data) => { });
        message.channel.send("Congratulations! Your profiles xp were cleared!");
    }

}