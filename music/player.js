const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { stream:AudioStream, video_basic_info, search, yt_validate } = require('play-dl');
const { MessageEmbed, InviteGuild } = require("discord.js");

module.exports = class {
    #queue = new Map();

    progressBar(value, maxValue, size) {
        const percentage = value / maxValue;
        const progress = Math.round(size * percentage); // Calculate the number of square caracters to fill the progress side.
        const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.
    
        const progressText = "▇".repeat(progress); // Repeat is creating a string with progress * caracters in it
        const emptyProgressText = "—".repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
        const percentageText = Math.round(percentage * 100) + "%"; // Displaying the percentage of the bar
    
        const Bar = progressText + emptyProgressText; // Creating the bar
        return { Bar, percentageText };
    };

    newQueue(guildId) {
        this.#queue.set(guildId, {
            connection: null, 
            voice_channel: null,
            player: null,
            current: null,
            queue: []
        });
    }

    getQueueForGuild(guildId) {
        return this.#queue.get(guildId)?.queue;
    }

    #destroyQueue(guildId) {
        const queue = this.#queue.get(guildId);
        if(!queue) return;
        queue.connection.destroy();
        this.#queue.delete(guildId);
    }

    async play(guildId, track) {
        const guildInfo = this.#queue.get(guildId);
        guildInfo.current = track;
        
        const stream = await AudioStream(track.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });
        guildInfo.player.play(resource);
        
        guildInfo.player.on("error", (err) => {
            track.channel.send("An error occurred while playing the track.");
            this.#destroyQueue(guildId);
        });
        
        guildInfo.player.on(AudioPlayerStatus.Idle, () => {
            const queueElm = guildInfo.queue.shift();
            
            if(!queueElm) {
                track.channel.send("Played all tracks leaving the channel.");
                this.#destroyQueue(guildId);
            }
        
            video_player(client, queueElm, guildId);
        });
        track.channel.send(`Now playing **${track.title}**`);
    }

    async #createEmbed(client, url, type) {
        const info = await video_basic_info(url);
        const embed = new MessageEmbed()
            .setURL(url)
            .setColor("DARK_AQUA")
            .setTimestamp(new Date())
            .setFooter(require("../config").embedFooter(client));
    
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

    async addTrack(client, message, args) {
        if (!message.member.voice?.channel) return channel.send('Connect to a Voice Channel');

        if(!this.#queue.has(message.guild.id)) {
            this.newQueue(message.guild.id);
            const queue = this.#queue.get(message.guild.id);
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause }});
            connection.subscribe(player);

            queue.connection = connection;
            queue.player = player;
            queue.voice_channel = message.member.voice.channel.id;

            let url = args.map(e => e.trim()).join(" ").trim();

            if(url === "") return message.channel.send("Please enter the link/name of the track");

            if (!(url.startsWith('https') && yt_validate(url) === 'video')) {
                const yt_info = await search(args.join(" "), {limit: 1});
                url = yt_info[0].url;
            }

            message.channel.send({embeds: [ await this.#createEmbed(client, url, "Playing") ]});
            this.play(message.guild.id, { url:url, channel:message.channel, title: (await video_basic_info(url)).video_details.title });
            return;
        }

        const queue = this.#queue.get(message.guild.id);

        if(queue.voice_channel !== message.member.voice.channel.id) {
            return message.channel.send("You have to be in the same voice channel as the bot to add new tracks.");
        }

        let url = args.map(e => e.trim()).join(" ").trim();

        if(url === "") return message.channel.send("Please enter the link/name of the track");

        if (!(url.startsWith('https') && yt_validate(url) === 'video')) {
            const yt_info = await search(args.join(" "), {limit: 1});
            url = yt_info[0].url;
        }

        queue.queue.push({ url:url, channel:message.channel, title: (await video_basic_info(url)).video_details.title });
        message.channel.send({embeds: [ await this.#createEmbed(client, url, "Added") ]});
    }

    skip(client, message) {
        if (!message.member.voice?.channel) return channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if(!queue) return message.channel.send("No queue for guild.");

        if(queue.voice_channel !== message.member.voice.channel.id) 
            return message.channel.send("You have to be in the same voice channel as the bot to skip tracks.");

        const queueElm = queue.queue.shift();

        if(!queueElm) {
            message.channel.send("Skipped last track. Leaving channel.");
            return this.#destroyQueue(messages.guild.id);
        } else {
            message.channel.send("Skipped track.");
        }

        this.play(message.guild.id, queueElm);
    }

    #handleVoiceStateChange(oldState, newState) {
        const queue = this.queues.get(oldState.guild.id);
        if (!queue || !queue.connection)
            return;
    }
}