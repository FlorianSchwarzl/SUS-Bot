const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    const sus = await guildModel.findOne({ guildId: guild.id });
    if (sus) return;

    console.info("Creating MongoDB entry for guild " + guild.name);

    global.functions.addGuildDocument(guild.id);

    client.commands.forEach(command => {
        if (command.name === "prepare") return;
        guild.commands?.create(command).catch(e => e);
    });
}
