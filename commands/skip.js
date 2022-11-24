module.exports = {
    name: "skip",
    description: "skip current track",

    run: (client, message, args, slash) => {
        const channel = slash? client.channels.cache.get(message.channelId):message.channel;
        if(slash) {
            message.reply("ok");
        }

        if (!message.member.voice?.channel) return channel.send('Connect to a Voice Channel');

        const guildInfo = client.queue.find(guild => guild.guildId === message.guild.id);

        if(!guildInfo) return channel.send("No queue for guild.");

        const queueElm = guildInfo.queue.shift();

        if(guildInfo.voice_channel !== message.member.voice.channel.id) 
            return channel.send("You have to be in the same voice channel as the bot to skip tracks.");
        
        channel.send("Skipped track.");

        if(!queueElm) {
            return guildInfo.connection.destroy();
        }

        require("./play").player(client, queueElm, message.guild.id);
    }
}