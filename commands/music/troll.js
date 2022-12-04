module.exports = {
    name: "troll",
    aliases: ["t"],
    category: "Music",
    description: "A wild troll appeared.",

    run(client, message, args, a, slash) {
        if (slash) message.reply({ content: "trollololoolololo", ephemeral: true });
        else message.delete();

        return client.player.troll(message);
    },
};