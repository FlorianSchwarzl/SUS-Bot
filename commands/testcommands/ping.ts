import { Message } from "discord.js";
import Client from "../../types/client";
import { Command } from "../../types/command";

const { EmbedBuilder, Colors } = require("discord.js");

const after = (client: Client<true>, message: Message, sentMessage: Message, start: number, slash = false) => {
    const EndDate = Date.now();
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Pong!")
        .addFields({ name: "Message Latency", value: `${Math.floor(EndDate - start)}ms` },
            { name: "API Latency", value: `${Math.round(client.ws.ping)}ms` })
        .setTimestamp(new Date);

    if (slash) {
        // @ts-expect-error // it does exist, ig...
        message.followUp({ embeds: [embed] });
    } else {
        sentMessage.delete();
        return { embeds: [embed] };
    }
}

//TODO: I implemented returning null for a reason... So ig I should use it here

module.exports = {
    description: "Pings the bot and displays the latency of the bot and the latency of the api.",

    async run(client, message, _args, _guildData, _userData, isSlashCommand) {
        const sendObj = { embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription("Please Wait...")] };
        const StartDate = Date.now();
        if (isSlashCommand) {
            // @ts-expect-error // I do think it exists but I just selected the wrong type bc I want to finish this as soon as possible // FIXME
            await message.deferReply();
            // @ts-expect-error // same here
            message.followUp(sendObj).then(msg => {
                // @ts-expect-error // FIXME pls, this is pure agony
                after(client, message, msg, StartDate, true);
            });
        } else {
            return message.channel!.send(sendObj)
                // @ts-expect-error // FIXME pls, this is pure agony
                .then((msg) => { return after(client, message, msg, StartDate) });
        }
    }
} as Command;
