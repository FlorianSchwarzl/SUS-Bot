const userModel = require("../schemas/user");
const { Types } = require("mongoose");

module.exports = (userId) => {
    (new userModel({
        _id: Types.ObjectId(),
        userId: userId,
    })).save();
}
