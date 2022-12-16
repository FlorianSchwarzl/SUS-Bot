const userModel = require("../schemas/user");
const addUserDocument = require("./addUserDocument");

module.exports = async (userId) => {
    let userData = await userModel.findOne({ userId: userId });
    if (!userData) {
        addUserDocument(userId);
        userData = await userModel.findOne({ userId: userId });
    }
    return userData;
}
