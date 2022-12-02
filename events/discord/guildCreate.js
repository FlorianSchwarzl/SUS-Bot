const mongoose = require('mongoose');
const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    const sus = await guildModel.findOne({ guildId: guild.id });
    if(sus) return;

    console.log("Creating MongoDB entry for guild " + guild.name);

    (new guildModel({
        _id: mongoose.Types.ObjectId(),
        guildId: guild.id,

        channels: {
            welcome: undefined,
            goodbye: undefined,
   
            allowed: []
        },

        counter: {
            current: 0,
            lastId: undefined,
        },
        
        warns:[],
        mutes:[],
        tempBans:[],
    })).save();

    client.commands.forEach(command => {
        if (command.name === "prepare") return;
        guild.commands?.create(command).catch(e => e);
    });
}