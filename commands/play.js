const { createAudioPlayer, createAudioResource , joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const { stream:AudioStream, video_basic_info, search } = require('play-dl');
const { isValidUrl } = require("is-youtube-url");
const { MessageEmbed } = require("discord.js");

const video_player = async (client, guildId) => {
    const guildInfo = client.queue.find(guild => guild.guildId === guildId);
    const queueElm = guildInfo.queue.shift();
    
    if(!queueElm) {
        guildInfo.connection.destroy();    
    }

    const stream = await AudioStream(queueElm.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    
    
    guildInfo.player.play(resource);
    
    guildInfo.player.on("error", (err) => {
        queueElm.message_channel.send("An error occurred while playing the track.")
    });

    guildInfo.player.on(AudioPlayerStatus.Idle, () => {
        video_player(client, guildId);
	});

    queueElm.message_channel.send(`Now playing **${(await video_basic_info(queueElm.url)).video_details.title}**`);
};

module.exports = {
	name: 'play',

	async run (client, message, args) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = client.queue.find(e => e.guildId === message.guild.id);

        if(queue) {
            let url;

            if (isValidUrl(args.join(" "))) {
                const yt_info = await search(args.join(" "), {limit: 1});
                url = yt_info[0].url;
            } else {
                url = args.join(" ");
            }

            queue.queue.push({ url:url, message_channel:message.channelId });
            message.channel.send({embeds: [
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setTitle(`Added track ${(await video_basic_info(url)).video_details.title}`)
                .setURL(url)
                .setColor("DARK_AQUA")
                .setImage((await video_basic_info(url)).video_details.thumbnails[0].url)
            ]});
        } else {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            let url;

            if (isValidUrl(args.join(" "))) {
                const yt_info = await search(args.join(" "), {limit: 1});
                url = yt_info[0].url;
            } else {
                url = args.join(" ");
            }

            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause }});
            connection.subscribe(player);

            client.queue.push({
                voice_channel: message.member.voice.channel.id,
                guildId: message.guild.id,
                connection: connection,
                player: player,
                queue: [{ url:url, message_channel:message.channel }],
            });

            message.channel.send({embeds: [
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setTitle(`Playing track ${(await video_basic_info(url)).video_details.title}`)
                .setURL(url)
                .setColor("DARK_AQUA")
                .setImage((await video_basic_info(url)).video_details.thumbnails[0].url)
            ]});

            video_player(client, message.guild.id);
        }
	}
}