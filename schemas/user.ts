const { Schema, model } = require(`mongoose`);

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: { require: true, type: String },

    level: {
        xp: { type: Number, default: 0 },
    },

    economy: {
        wallet: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
    },

    jobinfo: {
        id: { type: Number, default: 1 },
    }
});

export default model("user", userSchema, "users");
