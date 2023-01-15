import userModel from "../schemas/user";
import addUserDocument from "./addUserDocument";

export default async (userId: string) => {
    let userData = await userModel.findOne({ userId: userId });
    if (!userData) {
        addUserDocument(userId);
        userData = await userModel.findOne({ userId: userId });
    }
    return userData;
}
