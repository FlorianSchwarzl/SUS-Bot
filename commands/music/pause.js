module.exports = {
    name: 'pause',
    aliases: [],
    description: "Pauses the playing song.",

    run(client, message, args, a, slash) {
        if(slash) message.reply("ok");
        client.player.pause(message);
    }
}