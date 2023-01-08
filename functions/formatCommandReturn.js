const { Message } = require("discord.js");

module.exports = async (returnValue, command) => {
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
            || returnValue?.embeds !== undefined
            || returnValue?.files !== undefined
            || returnValue?.components !== undefined
            || returnValue?.content !== undefined
            || returnValue?.files !== undefined
            || returnValue?.attachments !== undefined
        ) && !(returnValue instanceof Message)) {
            if (typeof returnValue === "string") returnValue = { content: returnValue };
        } else if (returnValue?.DM !== undefined) {
            returnValue.DM = module.exports(returnValue.DM, command);
        } else if (returnValue !== null) reject(`Command "${command.name}" returned nothing.`);
        resolve(returnValue);
    });
}