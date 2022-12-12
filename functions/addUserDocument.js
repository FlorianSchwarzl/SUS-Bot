const userModel = require("../schemas/user");
const { Types } = require("mongoose");

module.exports = (userId) => {
    (new userModel({
        _id: Types.ObjectId(),
        userId: userId,

        level: {
            xp: 0,
        },

        economy: {
            wallet: 0,
            bank: 0,
        }
    })).save();
}