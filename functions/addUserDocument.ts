import userModel from "../schemas/user";
const { Types } = require("mongoose");

export default (userId: string) => {
    (new userModel({
        _id: Types.ObjectId(),
        userId: userId,
    })).save();
}
