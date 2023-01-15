import { GuildMember, Message, BaseChannel } from "discord.js";
import { CommandReturnWithoutString } from "../types/command";

const { createAudioPlayer, createAudioResource, joinVC, entersState, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
import { stream, video_basic_info, search, yt_validate, YouTubeVideo } from "play-dl";
import Client from "../types/client";
const { ImprovedArray } = require("sussy-util");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");

const playerControls = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('command:queue')
            .setLabel('☰')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('play_pause')
            .setLabel('׀׀')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('command:stop')
            .setLabel('◼')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('command:skip')
            .setLabel('>>')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('support')
            .setLabel('Support us!')
            .setStyle(ButtonStyle.Secondary),
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

    constructor(client: Client<true>) {
        this.#client = client;

        this.#client.on("voiceStateUpdate", (oldState, newState) => {
            const queue = this.getQueue(newState.guild.id);

            if (queue === void 0 || oldState.channelId === null) {
                return;
            }

            if (oldState.id !== this.#client.user.id) {
                if (this.#channelEmpty(oldState.channelId)) {
                    queue.current.channel.send("Leaving channel because it is empty.");
                    this.#destroyQueue(newState.guild.id);
                }
                return;
            }
            if (newState.channelId === void 0) {
                queue.current.channel.send("I have been kicked from the channel.");
                this.#destroyQueue(newState.guild.id);
            }

            if (oldState.channelId !== newState.channelId) {
                queue.voiceChannel = newState.channelId;
            }
        });
    }

    #newQueue(guildId: string) {
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

    #destroyQueue(guildId: string) {
        const guildInfo = this.#queue.get(guildId);
        if (guildInfo === void 0) return;
        if (guildInfo.lastNowPlayingMessage !== void 0) {
            guildInfo.lastNowPlayingMessage.delete().catch((e: Error) => { });
        }
        guildInfo.connection.destroy();
        this.#queue.delete(guildId);
    }

    async play(guildId: string, track: QueueElement) {
        const guildInfo = this.#queue.get(guildId);
        if (guildInfo === void 0) return;
        guildInfo.current = track;

        const streamReturn = await stream(track.url);
        const resource = createAudioResource(streamReturn.stream, { inputType: streamReturn.type });

        guildInfo.player.play(resource);
        if (guildInfo.lastNowPlayingMessage !== void 0) {
            guildInfo.lastNowPlayingMessage.delete().catch((e: Error) => { });
        }
        // @ts-expect-error
        guildInfo.lastNowPlayingMessage = await track.channel.send({ embeds: [await this.#createEmbed(track, "Now playing")], components: [playerControls] });
    }

    async #createEmbed(info: QueueElement, type: string) {
        const embed = new EmbedBuilder()
            .setURL(info.url)
            .setColor(Colors.Red)
            .setTimestamp(new Date())
            // @ts-expect-error
            .setFooter(this.#client.config.embedFooter(this.#client));

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

    async addTrack(message: Message, args: string[]) {
        if (message.member!.voice?.channel === void 0 || message.member!.voice?.channel === null) return "Connect to a Voice Channel";

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
        if (info === void 0) {
            if (this.#queue.get(message.guild!.id)?.queue.length === 0) return;
            let returnValue = this.skip(message) as CommandReturnWithoutString;
            returnValue!.content = "Can't play tracks requiring age verification! Skipping...";
            return returnValue;
        }

        if (!this.#queue.has(message.guild!.id)) {
            this.#newQueue(message.guild!.id);
            const queue = this.#queue.get(message.guild!.id);
            const connection = joinVC({
                channelId: message.member!.voice.channel.id,
                guildId: message.guild!.id,
                adapterCreator: message.guild!.voiceAdapterCreator
            });

            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
            connection.subscribe(player);

            queue.connection = connection;
            queue.player = player;
            queue.voiceChannel = message.member!.voice.channel.id;
            queue.guildId = message.guild!.id;

            queue.connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    this.#destroyQueue(queue.guildId);
                    return "There was an error connecting to the voice channel.";
                }
            });

            queue.player.on("error", (err: Error) => {
                message.channel.send("An error occurred while playing the track.");
                this.#destroyQueue(message.guild!.id);
            });

            queue.player.on(AudioPlayerStatus.Idle, () => {
                if (queue.loop) queue.queue.push(queue.current);
                const queueElement = queue.queue.shift();
                if (queueElement === void 0) {
                    this.#destroyQueue(message.guild!.id);
                    return { content: "Played all tracks leaving the channel.", announce: true };
                }
                this.play(message.guild!.id, queueElement);
            });

            // @ts-expect-error // I gotta make a type for this
            this.play(message.guild!.id, { url: url, channel: message.channel, title: info.title, duration: info.durationRaw, thumbnails: info.thumbnails });
            return "Started playing track!";
        }

        const queue = this.#queue.get(message.guild!.id);

        if (queue.voiceChannel !== message.member!.voice.channel.id) {
            return "You have to be in the same voice channel as the bot to add new tracks.";
        }

        queue.queue.push({ url: url, channel: message.channel, title: info.title, duration: info.durationRaw, thumbnails: info.thumbnails });
        // @ts-expect-error // idfk, it's getting ignored anyway
        return ({ embeds: [await this.#createEmbed(info, "Added")], deleteReply: 10, announce: true });
    }

    skip(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to skip tracks.";

        const queueElement = queue.queue.shift();

        if (queueElement === void 0 && !queue.loop) {
            if (queue.loop) {
                this.play(message.guild!.id, queueElement || queue.current);
            } else {
                this.#destroyQueue(message.guild!.id);
            }
            return { content: "Skipped last track. Leaving channel!", announce: true };
        } else {
            this.play(message.guild!.id, queueElement || queue.current);
            return { content: "Skipped track.", announce: true };
        }
    }

    stop(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to stop the bot.";

        this.#destroyQueue(message.guild!.id);
        return { content: "Leaving channel.", announce: true };
    }

    shuffle(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to shuffle the queue.";

        queue.queue.shuffle();
        return { content: "Shuffled the Queue.", announce: true };
    }

    getQueue(guildId: string) {
        return this.#queue.get(guildId);
    }

    getCurrent(guildId: string) {
        return this.#queue.get(guildId)?.current;
    }

    clearQueue(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0 || queue.queue.length == 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to clear the queue.";

        queue.queue.clear();
        return { content: "Cleared queue.", announce: true };
    }

    #channelEmpty(channelId: string) {
        // @ts-expect-error // I gotta make this compatible with DM Channels
        return this.#client.channels.cache.get(channelId)?.members.filter((member: GuildMember) => !member.user.bot).size === 0;
    }

    troll(message: Message) {
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return;
        queue.queue.clear();
        /* Playing Never Gonna Give You Up bc we do miniscule amounts of trolling */
        // @ts-expect-error // I gotta make a type for this
        this.play(message.guild!.id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", channel: message.channel, title: "Rick Astley - Never Gonna Give You Up (Official Music Video)", duration: "3:32" });
    }

    toggleLoop(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to toggle looping.";

        queue.loop = !queue.loop;
        if (queue.loop) {
            return { content: "Looping is now enabled.", announce: true };
        } else {
            return { content: "Looping is now disabled.", announce: true };
        }
    }

    pause(message: Message) {
        if (message.member!.voice?.channel === void 0) return "You have to be in the same voice channel as the bot to pause the track";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "There is nothing playing";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to pause the track";

        if (queue.player.state.status == "playing") {
            queue.player.pause();
            return { content: "The track has been paused", announce: true };
        } else if (queue.player.state.status == "paused") {
            return "The track is already paused";
        }
    }

    resume(message: Message) {
        if (message.member!.voice?.channel === void 0) return "Connect to a Voice Channel";
        const queue = this.#queue.get(message.guild!.id);
        if (queue === void 0) return "No queue for guild.";

        if (queue.voiceChannel !== message.member!.voice.channel!.id)
            return "You have to be in the same voice channel as the bot to pause";

        if (queue.player.state.status == "paused") {
            queue.player.unpause();
            return { content: "The track has been resumed", announce: true };
        } else if (queue.player.state.status == "playing") {
            return "The track is already playing";
        }
    }
};

async function isAgeRestricted(url: string) {
    try {
        (await video_basic_info(url)).video_details;
    } catch (err) {
        return true;
    }
    return false;
}

type QueueElement = {
    url: string;
    channel: BaseChannel;
    title: string;
    duration?: string;
    thumbnails: any[];
};