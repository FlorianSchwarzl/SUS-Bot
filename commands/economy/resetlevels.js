const userList = require("../../schemas/user");
module.exports = {
    name: "resetxp",
    description: "Clear your profile",
    aliases: ["resetlevels"],

    run(client, message, args, guildData, userData, isSlashCommand) {
        userData.level.xp = 0;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
        message.channel.send("Congratulations! Your profiles xp were cleared!");
    }

}
