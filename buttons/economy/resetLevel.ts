import { Component } from "../../types/command";

const userList = require("../../schemas/user");

module.exports = {
    run(client, interaction, args, guildData, userData) {
        userData.level.xp = 0;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err: Error, data: any) => { });
        return { content: "Your level has been reset!", disableOriginal: true };
    }
} as Component;