import { Component } from "../../types/command";

import userList from "../../schemas/user";

module.exports = {
	run(_client, _interaction, _args, _guildData, userData) {
		userData.level.xp = 0;
		userList.findByIdAndUpdate(userData._id, { level: userData.level }, (_err: Error, _data: unknown) => { });
		return { content: "Your level has been reset!", disableOriginal: true };
	}
} as Component;