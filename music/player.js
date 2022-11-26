const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { stream:AudioStream, video_basic_info, search } = require('play-dl');

module.exports = class {
    #queue = new Map();

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
        return this.#queue.get(guildId);
    }

    play(guildId) {
        if(!this.#queue.has(guildId)) {
            return;
        }

        const queue = this.#queue.get(guildId);
    }

    addTrack(message, args) {
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


        }
    }
}