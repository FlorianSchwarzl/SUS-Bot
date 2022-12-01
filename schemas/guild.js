const { Schema } = require('mongoose');

const guildSchema = new Schema({
    _id:Schema.Types.ObjectId,
    guildId: String,
    channels: {
        welcome: String,
        goodbye: String,
        allowed: [
            String
        ],
        counter: String
    },
    counter: {
        current: Number,
        lastId: String
    }
});

module.exports = guildSchema;