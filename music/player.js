const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { stream: AudioStream, video_basic_info, search } = require('play-dl');
const { MessageEmbed } = require("discord.js");

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

    play(guildId) {
        if (!this.#queue.has(guildId)) {
            return;
        }

        const queue = this.#queue.get(guildId);

        if (queue.queue.length === 0) {

        }
    }

    async #createEmbed(url, type) {
        const info = await video_basic_info(url);
        const embed = new MessageEmbed()
            .setURL(url)
            .setColor("DARK_AQUA");

        if (info.video_details.title) {
            embed.setTitle(`${type} track ${info.video_details.title}`);
        }

        if (info.video_details.thumbnails) {
            const thumbail = info.video_details.thumbnails[info.video_details.thumbnails.length - 1];
            if (thumbail) {
                embed.setImage(thumbail.url);
            }
        }

        return embed;
    }

    async addTrack(message, args) {
        if (!this.#queue.has(message.guild.id)) {
            this.newQueue(message.guild.id);
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
            queue.voice_channel = message.member.voice.channel.id;
            message.channel.send({ embeds: [await this.#createEmbed(url, "Playing")] });
        }
    }

    #handleVoiceStateChange(oldState, newState) {
        const queue = this.queues.get(oldState.guild.id);
        if (!queue || !queue.connection)
            return;
    }
}