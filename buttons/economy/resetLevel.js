const userList = require("../../schemas/user");

module.exports = {
    run(client, interaction, args, guildData, userData) {
        userData.level.xp = 0;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
        return { content: "Your level has been reset!", disableOriginal: true };
    }
}