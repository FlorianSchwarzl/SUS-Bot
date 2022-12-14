const guildModel = require("../schemas/guild");
const addGuildDocument = require("./addGuildDocument");

module.exports = async (guildId) => {
    let guildData = await guildModel.findOne({ guildId: guildId });
    if (!guildData) {
        addGuildDocument(guildId);
        guildData = await guildModel.findOne({ guildId: guildId });
    }
    return guildData;
}
