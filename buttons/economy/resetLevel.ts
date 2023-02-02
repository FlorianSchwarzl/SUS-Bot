import { Component } from "../../types/command";

const userList = require("../../schemas/user");

module.exports = {
    run(_client, _interaction, _args, _guildData, userData) {
        userData.level.xp = 0;
        userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err: Error, data: any) => { err; data; });
        return { content: "Your level has been reset!", disableOriginal: true };
    }
} as Component;