const { createAudioPlayer, createAudioResource, joinVoiceChannel, entersState, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const { stream: AudioStream, video_basic_info, search, yt_validate } = require("play-dl");
const { ImprovedArray } = require("sussy-util");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const playerControls = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('command:queue')
            .setLabel('☰')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('play_pause')
            .setLabel('׀׀')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('command:stop')
            .setLabel('◼')
            .setStyle('DANGER'),
        new MessageButton()
            .setCustomId('command:skip')
            .setLabel('>>')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('support')
            .setLabel('Support us!')
            .setStyle('SECONDARY'),
    );

module.exports = class Player {
    //TODO: CHANGE VARIABLE NAME FROM QUEUE TO ?????
    //TODO: Add previous function --> Completely rewrite the queue system
    //TODO: Add playlist support(https://stackoverflow.com/questions/13358290/how-get-all-videos-from-a-playlist-using-youtube-api)
    //TODO: Add Spotify support
    //TODO: Add Soundcloud support
    //TODO: Don't get sued by YouTube
    //TODO: Complete rewrite of the player
    //BUG: See issue #17

    #queue = new Map();
    #client;

    constructor(client) {
        this.#client = client;

        this.#client.on("voiceStateUpdate", (oldState, newState) => {
            const queue = this.getQueue(newState.guild.id);

            if (queue === undefined || oldState.channelId === null) {
                return;
            }

            if (oldState.id !== this.#client.user.id) {
                if (this.#channelEmpty(oldState.channelId)) {
                    queue.current.channel.send("Leaving channel because it is empty.");
                    this.#destroyQueue(newState.guild.id);
                }
                return;
            }
            if (newState.channelId === undefined) {
                queue.current.channel.send("I have been kicked from the channel.");
                this.#destroyQueue(newState.guild.id);
            }

            if (oldState.channelId !== newState.channelId) {
                queue.voiceChannel = newState.channelId;
                client.voiceChannel = newState.channelId;
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
        const guildInfo = this.#queue.get(guildId);
        if (guildInfo === undefined) return;
        if (guildInfo.lastNowPlayingMessage !== undefined) {
            guildInfo.lastNowPlayingMessage.delete().catch((e) => { });
        }
        guildInfo.connection.destroy();
        this.#queue.delete(guildId);
    }

    async play(guildId, track) {
        const guildInfo = this.#queue.get(guildId);
        if (guildInfo === undefined) return;
        guildInfo.current = track;

        const stream = await AudioStream(track.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        guildInfo.player.play(resource);
        if (guildInfo.lastNowPlayingMessage !== undefined) {
            guildInfo.lastNowPlayingMessage.delete().catch((e) => { });
        }
        guildInfo.lastNowPlayingMessage = await track.channel.send({ embeds: [await this.#createEmbed(track, "Now playing")], components: [playerControls] });
    }

    async #createEmbed(info, type) {
        const embed = new MessageEmbed()
            .setURL(info.url)
            .setColor("RANDOM")
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
        if (message.member.voice?.channel === undefined || message.member.voice?.channel === null) return "Connect to a Voice Channel";

        let videoName = args.map(e => e.trim()).join(" ").trim();

        if (videoName === "") return "Please enter the link/name of the track";

        let url;
        if (videoName.startsWith("https") && yt_validate(videoName) === "video") {
            url = videoName;
        } else {
            const yt_infos = await search(args.join(" "), { limit: 10 });
            let currentInfo = 0;
            do {
                url = yt_infos[currentInfo].url;
                currentInfo++;
            } while (await isAgeRestricted(url) && currentInfo < yt_infos.length);
        }

        let info;
        try {
            info = (await video_basic_info(url)).video_details;
        } catch (err) {

        }
        if (info === undefined) {
            message.channel.send("Can't play tracks requiring age verification! Skipping...");
            if (this.#queue.get(message.guild.id)?.queue.length === 0) return;
            return this.skip(message);
        }

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
            this.#client.voiceChannel = message.member.voice.channel.id;
            queue.guildId = message.guild.id;

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
                const queueElement = queue.queue.shift();
                if (queueElement === undefined) {
                    message.channel.send("Played all tracks leaving the channel.");
                    return this.#destroyQueue(message.guild.id);
                }
                this.play(message.guild.id, queueElement);
            });

            this.play(message.guild.id, { url: url, channel: message.channel, title: info.title, duration: info.durationRaw, thumbnails: info.thumbnails });
            return "Started playing track!";
        }

        const queue = this.#queue.get(message.guild.id);

        if (queue.voiceChannel !== message.member.voice.channel.id) {
            return "You have to be in the same voice channel as the bot to add new tracks.";
        }

        queue.queue.push({ url: url, channel: message.channel, title: info.title, duration: info.durationRaw, thumbnails: info.thumbnails });
        return ({ embeds: [await this.#createEmbed(info, "Added")], deleteReply: 10 });
    }

    skip(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to skip tracks.";

        const queueElement = queue.queue.shift();

        if (queueElement === undefined && !queue.loop) {
            if (queue.loop) {
                this.play(message.guild.id, queueElement || queue.current);
            } else {
                this.#destroyQueue(message.guild.id);
            }
            return { content: "Skipped last track. Leaving channel!", announce: true };
        } else {
            this.play(message.guild.id, queueElement || queue.current);
            return { content: "Skipped track.", announce: true };
        }
    }

    stop(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to stop the bot.";

        this.#destroyQueue(message.guild.id);
        return { content: "Leaving channel.", announce: true };
    }

    shuffle(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to shuffle the queue.";

        queue.queue.shuffle();
        return { content: "Shuffled the Queue.", announce: true };
    }

    getQueue(guildId) {
        return this.#queue.get(guildId);
    }

    getCurrent(guildId) {
        return this.#queue.get(guildId)?.current;
    }

    clearQueue(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined || queue.queue.length == 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to clear the queue.";

        queue.queue.clear();
        return { content: "Cleared queue.", announce: true };
    }

    #channelEmpty(channelId) {
        return this.#client.channels.cache.get(channelId)?.members.filter((member) => !member.user.bot).size === 0;
    }

    troll(message) {
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return;
        queue.queue.clear();
        /* Playing Never Gonna Give You Up bc we do miniscule amounts of trolling */
        this.play(message.guild.id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", channel: message.channel, title: "Rick Astley - Never Gonna Give You Up (Official Music Video)", duration: "3:32" });
    }

    toggleLoop(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to toggle looping.";

        queue.loop = !queue.loop;
        if (queue.loop) {
            return { content: "Looping is now enabled.", announce: true };
        } else {
            return { content: "Looping is now disabled.", announce: true };
        }
    }

    pause(message) {
        if (message.member.voice?.channel === undefined) return "You have to be in the same voice channel as the bot to pause the track";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "There is nothing playing";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to pause the track";

        if (queue.player.state.status == "playing") {
            queue.player.pause();
            return { content: "The track has been paused", announce: true };
        } else if (queue.player.state.status == "paused") {
            return "The track is already paused";
        }
    }

    resume(message) {
        if (message.member.voice?.channel === undefined) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild.id);
        if (queue === undefined) return "No queue for guild.";

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return "You have to be in the same voice channel as the bot to pause";

        if (queue.player.state.status == "paused") {
            queue.player.unpause();
            return { content: "The track has been resumed", announce: true };
        } else if (queue.player.state.status == "playing") {
            return "The track is already playing";
        }
    }
};

async function isAgeRestricted(url) {
    try {
        (await video_basic_info(url)).video_details;
    } catch (err) {
        return true;
    }
    return false;
}
