const addGuildDocument = require("../../functions/addGuildDocument");
const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    const sus = await guildModel.findOne({ guildId: guild.id });
    if(sus) return;

    console.log("Creating MongoDB entry for guild " + guild.name);

    addGuildDocument(guild);

    client.commands.forEach(command => {
        if (command.name === "prepare") return;
        guild.commands?.create(command).catch(e => e);
    });
}