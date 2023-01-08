const userList = require("../../schemas/user");

module.exports = {
    run(client, interaction, args, guildData, userData) {
        userData.economy.wallet = 0;
        userData.economy.bank = 0;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
        return { content: "Your balance has been reset!", disableOriginal: true };
    }
}