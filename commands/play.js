const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl')
const { isValidUrl } = require('is-youtube-url');

module.exports = {
	name: 'play',

	async run (client, message, args) {
        if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel');
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        
        let url;

        if (isValidUrl(args.join(" "))) {
            const yt_info = await play.search(args.join(" "), {limit: 1});
            url = yt_info[0].url;
        } else {
            url = args.join(" ");
        }

        const stream = await play.stream(url);
        const resource = createAudioResource(stream.stream, {inputType: stream.type});
        const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play }});

        player.play(resource);
        connection.subscribe(player);
	}
}