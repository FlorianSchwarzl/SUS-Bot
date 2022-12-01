const mongoose = require('mongoose');
const guildModel = require("../../schemas/guild");

module.exports = (client, guild) => {
    const sus = guildModel.findOne( { guildId: guild.id } );
    
}