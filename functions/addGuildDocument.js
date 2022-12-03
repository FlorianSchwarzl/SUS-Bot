const guildModel = require("../schemas/guild");
const { Types } = require("mongoose");

module.exports = (guild) => {
    (new guildModel({
        _id: Types.ObjectId(),
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

        warns: [],
        tempBans: [],
    })).save();
}