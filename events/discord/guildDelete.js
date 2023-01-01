const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    console.info("Deleting MongoDB entry for guild " + guild.name);
    guildModel.findOneAndDelete({ guildId: guild.id }, () => { });
}
