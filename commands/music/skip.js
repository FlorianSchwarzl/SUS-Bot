module.exports = {
    name: "skip",
    description: "skip current track",

    run: (client, message, args, slash) => {
        if(slash) {
            slash.reply("ok");
        }
        client.player.skip(client, message);
    }
}