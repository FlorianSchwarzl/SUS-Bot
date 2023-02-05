import userModel from "../schemas/user";
import addUserDocument from "./addUserDocument";
import { UserData } from "../types/data";

export default async (userId: string): Promise<UserData> => {
	let userData = await userModel.findOne({ userId: userId });
	if (!userData) {
		addUserDocument(userId);
		userData = await userModel.findOne({ userId: userId });
	}
	return userData;
};
