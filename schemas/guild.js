const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,

    channels: {
        welcome: String,
        goodbye: String,
        counter: String,

        allowed: [
            String
        ],
    },

    counter: {
        current: Number,
        lastId: String
    },

    warns: [
        { userId: String, count: Number }
    ],

    tempBans: [
        { userId: String, endDate: Date }
    ],
});

module.exports = model("guild", guildSchema, "guilds");