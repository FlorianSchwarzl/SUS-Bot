import { Component } from "../../types/command";

import userList from "../../schemas/user";

module.exports = {
    run(_client, _interaction, _args, _guildData, userData) {
        userData.economy.wallet = 0;
        userData.economy.bank = 0;
        userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err: Error, data: any) => { err; data; });
        return { content: "Your balance has been reset!", disableOriginal: true };
    }
} as Component;