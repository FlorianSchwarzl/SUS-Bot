const { createAudioPlayer, createAudioResource, joinVoiceChannel, entersState, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { stream: AudioStream, video_basic_info, search, yt_validate } = require('play-dl');
const { ImprovedArray } = require("sussyutilbyraphaelbader");
const { MessageEmbed } = require("discord.js");

module.exports = class {
    // TODO: CHANGE VARIABLE NAME FROM QUEUE TO QUEUES

    #queue = new Map();
    #client;

    constructor(client) {
        this.#client = client;

        this.#client.on("voiceStateUpdate", (oldState, newState) => {
            const queue = this.getQueue(newState.guild.id);

            if(!queue || !oldState.channelId) {
                return;
            }

            if(oldState.id !== this.#client.user.id) {
                if(this.#channelEmpty(oldState.channelId)) {
                    queue.current.channel.send("Leaving channel because it is empty.");
                    this.#destroyQueue(newState.guild.id);
                }
                return;
            }
            if(!newState.channelId) {
                queue.current.channel.send("I have been kicked from the channel.");
                this.#destroyQueue(newState.guild.id);
            }

            if(oldState.channelId !== newState.channelId) {
                queue.voiceChannel = newState.channelId;
            }
        });
    }

    #newQueue(guildId) {
        this.#queue.set(guildId, {
            connection: null,
            voiceChannel: null,
            player: null,
            current: null,
            loop: false,
            guildId: null,
            queue: new ImprovedArray()
        });
    }

    #destroyQueue(guildId) {
        const queue = this.#queue.get(guildId);
        if (!queue) return;
        queue.connection.destroy();
        this.#queue.delete(guildId);
    }

    async play(guildId, track) {
        const guildInfo = this.#queue.get(guildId);
        if (!guildInfo) return;
        guildInfo.current = track;

        const stream = await AudioStream(track.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        guildInfo.player.play(resource);
        track.channel.send(`Now playing **${track.title}**`);
    }

    async #createEmbed(info, type) {
        const embed = new MessageEmbed()
            .setURL(info.url)
            .setColor("DARK_AQUA")
            .setTimestamp(new Date())
            .setFooter(require("../config").embedFooter(this.#client));

        if (info.title) {
            embed.setTitle(`${type} track ${info.title}`);
        }

        if (info.thumbnails) {
            const thumbnail = info.thumbnails[info.thumbnails.length - 1];
            if (thumbnail) {
                embed.setImage(thumbnail.url);
            }
        }

        return embed;
    }

    async addTrack(message, args) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');

        if (!this.#queue.has(message.guild.id)) {
            this.#newQueue(message.guild.id);
            const queue = this.#queue.get(message.guild.id);
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
            connection.subscribe(player);

            queue.connection = connection;
            queue.player = player;
            queue.voiceChannel = message.member.voice.channel.id;
            queue.guildId = message.guild.id;

            let url = args.map(e => e.trim()).join(" ").trim();

            if (url === "") return message.channel.send("Please enter the link/name of the track");

            if (!(url.startsWith('https') && yt_validate(url) === 'video')) {
                const yt_info = await search(args.join(" "), { limit: 1 });
                url = yt_info[0].url;
            }

            queue.connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    message.channel.send("There was an error connecting to the voice channel.");
                    this.#destroyQueue(queue.guildId);
                }
            });

            queue.player.on("error", (err) => {
                message.channel.send("An error occurred while playing the track.");
                this.#destroyQueue(message.guild.id);
            });

            queue.player.on(AudioPlayerStatus.Idle, () => {
                if (queue.loop) queue.queue.push(queue.current);
                const queueElm = queue.queue.shift();
                if (!queueElm) {
                    message.channel.send("Played all tracks leaving the channel.");
                    return this.#destroyQueue(message.guild.id);
                }
                this.play(message.guild.id, queueElm);
            });

            const info = (await video_basic_info(url)).video_details;
            message.channel.send({ embeds: [await this.#createEmbed(info, "Playing")] });
            this.play(message.guild.id, { url: url, channel: message.channel, title: info.title, duration: info.durationRaw });
            return;
        }

        const queue = this.#queue.get(message.guild.id);

        if (queue.voiceChannel !== message.member.voice.channel.id) {
            return message.channel.send("You have to be in the same voice channel as the bot to add new tracks.");
        }

        let url = args.map(e => e.trim()).join(" ").trim();

        if (url === "") return message.channel.send("Please enter the link/name of the track");

        if (!(url.startsWith('https') && yt_validate(url) === 'video')) {
            const yt_info = await search(args.join(" "), { limit: 1 });
            url = yt_info[0].url;
        }

        const info = (await video_basic_info(url)).video_details;
        queue.queue.push({ url: url, channel: message.channel, title: info.title, duration: info.durationRaw });
        message.channel.send({ embeds: [await this.#createEmbed(info, "Added")] });
    }

    skip(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to skip tracks.");

        const queueElm = queue.queue.shift();

        if (!queueElm && !(queue.loop)) {
            message.channel.send("Skipped last track. Leaving channel.");
            return this.#destroyQueue(message.guild.id);
        } else {
            message.channel.send("Skipped track.");
        }

        this.play(message.guild.id, queueElm || queue.current);
    }

    stop(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to stop the bot.");

        message.channel.send("Leaving channel.");
        this.#destroyQueue(message.guild.id);
    }

    shuffle(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to shuffle the queue.");

        queue.queue.shuffle();
        message.channel.send("Shuffled the Queue.");
    }

    getQueue(guildId) {
        return this.#queue.get(guildId);
    }

    getCurrent(guildId) {
        return this.#queue.get(guildId)?.current;
    }

    clearQueue(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue || queue.queue.length == 0) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to clear the queue.");

        queue.queue.clear();
        message.channel.send("Cleared queue.");
    }

    #channelEmpty(channelId) {
        return this.#client.channels.cache.get(channelId).members.filter((member) => !member.user.bot).size === 0;
    }

    troll(message) {
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return;
        queue.queue.clear();
        /* Playing Never Gonna Give You Up bc we do miniscule amounts of trolling */
        this.play(message.guild.id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", channel: message.channel, title: "Rick Astley - Never Gonna Give You Up (Official Music Video)", duration: "3:32" });
    }

    toggleLoop(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to toggle looping.");

        queue.loop = !queue.loop;
        if (queue.loop) {
            message.channel.send("Looping is now enabled.");
        } else {
            message.channel.send("Looping is now disabled.");
        }
    }

    pause(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to pause.");

        if (queue.player.state.status == "playing") {
            queue.player.pause();
            message.channel.send("Pausing the track");
        } else if (queue.player.state.status == "paused") {
            message.channel.send("The track is already paused.");
        }
    }

    resume(message) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.channel.send("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.channel.send("You have to be in the same voice channel as the bot to pause.");

        if (queue.player.state.status == "paused") {
            queue.player.unpause();
            message.channel.send("Resuming the track");
        } else if (queue.player.state.status == "playing") {
            message.channel.send("The track is already playing.");
        }
    }
}