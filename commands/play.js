const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { stream:AudioStream, video_basic_info, search } = require('play-dl');
const { validateURL } = require("../function/isValidYoutubeURL");
const { MessageEmbed } = require("discord.js");

const video_player = async (client, track, guildId) => {
    const guildInfo = client.queue.find(guild => guild.guildId === guildId);
    guildInfo.current = track;

    const stream = await AudioStream(track.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    guildInfo.player.play(resource);
    
    guildInfo.player.on("error", (err) => {
        track.message_channel.send("An error occurred while playing the track.");
        try {
            guildInfo.connection.destroy();
        } catch(e) {}
    });

    guildInfo.player.on(AudioPlayerStatus.Idle, () => {
        const queueElm = guildInfo.queue.shift();
        
        if(!queueElm) {
            track.message_channel.send("Played all tracks leaving the channel.");
            try {
                return guildInfo.connection.destroy();
            } catch (e) {return}
        }

        video_player(client, queueElm, guildId);
	});

    track.message_channel.send(`Now playing **${(await video_basic_info(track.url)).video_details.title}**`);
};

const createEmbed = async(url, type) => {
    const info = await video_basic_info(url);
    const embed = new MessageEmbed()
        .setURL(url)
        .setColor("DARK_AQUA");

    if(info.video_details.title) {
        embed.setTitle(`${type} track ${info.video_details.title}`);
    }

    if(info.video_details.thumbnails) {
        const thumbail = info.video_details.thumbnails[info.video_details.thumbnails.length - 1];
        if(thumbail) {
            embed.setImage(thumbail.url);
        }
    }

    return embed;
}

module.exports = {
	name: 'play',
    description: "Play or Queue a new video",

    options: [
        {
            name: "query",
            type: "STRING",
            description: "link / name of track to play",
            required: true
        }
    ],

	async run (client, message, args, interaction = false) {
        const channel = interaction? client.channels.cache.get(message.channelId):message.channel;
        if(interaction) { 
            message.deferReply();
        }
        if (!message.member.voice?.channel) return channel.send('Connect to a Voice Channel');
        const queue = client.queue.find(e => e.guildId === message.guild.id);

        if(queue) {
            if(queue.voice_channel !== message.member.voice.channel.id) {
                return channel.send("You have to be in the same voice channel as the bot to add new tracks.");
            }

            let url;

            if (!validateURL(args.join(" "))) {
                const yt_info = await search(args.join(" "), {limit: 1});
                url = yt_info[0].url;
            } else {
                url = args.join(" ");
            }

            queue.queue.push({ url:url, message_channel:channel });
            channel.send({embeds: [ await createEmbed(url, "Added") ]});
        } else {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            let url;

            if (!validateURL(args.join(" "))) {
                const yt_info = await search(args.join(" "), {limit: 1});
                url = yt_info[0].url;
            } else {
                url = args.join(" ");
            }

            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause }});
            connection.subscribe(player);

            connection.on(VoiceConnectionStatus.Destroyed, (oldS, newS) => {
                channel.send("Played all tracks leaving the channel.");
                const index = client.queue.findIndex((e) => e.guildId === message.guild.id);
                if(index>=0) {
                    client.queue.remove(index);
                }
            });

            client.queue.push({
                voice_channel: message.member.voice.channel.id,
                guildId: message.guild.id,
                connection: connection,
                player: player,
                current: null,
                queue: [],
            });

            channel.send({embeds: [ await createEmbed(url, "Playing") ]});
            video_player(client, { url:url, message_channel:channel }, message.guild.id);
        }

        if(interaction) message.followUp("OK");
    },

    player:video_player
}