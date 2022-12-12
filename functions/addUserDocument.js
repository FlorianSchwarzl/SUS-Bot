const userModel = require("../schemas/user");
const { Types } = require("mongoose");

module.exports = (user) => {
    (new userModel({
        _id: Types.ObjectId(),
        userid: user.id,
    })).save();
}