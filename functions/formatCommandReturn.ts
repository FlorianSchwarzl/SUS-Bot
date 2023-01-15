import { Command, CommandReturns } from "../types/command";

const { Message } = require("discord.js");

module.exports = async (returnValue: any, command: Command) => {
    return await new Promise(async (resolve, reject) => {
        if (returnValue instanceof Promise) {
            const timeout = setTimeout(() => {
                reject(`Command ${command.name} took too long to execute!`);
            }, 4500);
            returnValue = await returnValue;
            clearTimeout(timeout);
        }
        if ((
            (typeof returnValue === "string" && returnValue !== "")
            || returnValue?.embeds !== void 0
            || returnValue?.files !== void 0
            || returnValue?.components !== void 0
            || returnValue?.content !== void 0
            || returnValue?.files !== void 0
            || returnValue?.attachments !== void 0
        ) && !(returnValue instanceof Message)) {
            if (typeof returnValue === "string") returnValue = { content: returnValue };
        } else if (returnValue?.DM !== void 0) {
            returnValue.DM = module.exports(returnValue.DM, command);
        } else if (returnValue !== null) reject(`Command "${command.name}" returned nothing.`);
        resolve(returnValue);
    });
}