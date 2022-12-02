const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    console.log("Deleting MongoDB entry for guild " + guild.name);
    await guildModel.findOneAndDelete({ guildId: guild.id }, () => {});
}