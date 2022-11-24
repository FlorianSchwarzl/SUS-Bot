module.exports = {
    name: "skip",

    run: (client, message, args) => {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');

        const guildInfo = client.queue.find(guild => guild.guildId === message.guild.id);

        if(!guildInfo) return message.channel.send("No queue for guild.");

        const queueElm = guildInfo.queue.shift();

        if(guildInfo.voice_channel !== message.member.voice.channel.id) 
            return message.channel.send("You have to be in the same voice channel as the bot to skip tracks.");
        
        message.channel.send("Skipped track.");

        if(!queueElm) {
            message.channel.send("Played all tracks leaving the channel.");
            client.queue.remove(client.queue.findIndex((e) => e.guildId === guildInfo.guildId));
            return guildInfo.connection.destroy();
        }

        require("./play").player(client, queueElm, message.guild.id);
    }
}