const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');

const song_constructor = async (input, message) => {
	let song;

	if (ytdl.validateURL(input)) {
		const song_info = await ytdl.getInfo(input);
		song = { title: song_info.videoDetails.title, url: input }
	} else {
		const video_finder = async (query) =>{
			const video_result = await ytsearch(query);
			return (video_result.videos.length > 1) ? video_result.videos[0] : null;
		}

		const video = await video_finder(input);
		if (video){
			song = { title: video.title, url: video.url }
		} else {
			return "NO Song found!";
		}
	}

	return { channel: message.channelId, voice: message.member.voice.channel.id, song: song, video_player: video_player };
}

const video_player = async (guild, song, client, message) => {
    const song_queue = client.queue.get(guild.id);

    if (!song) {
        song_queue.connection.destroy();
        client.queue.delete(guild.id);
		client.isReadyForTextToSpeech = true;
        return;
    }

	const stream = ytdl(song.song.url, { filter: 'audioonly' });
	
	const resource = createAudioResource(stream, { inputType: StreamType.WebmOpus });

	song_queue.player.play(resource);
	song_queue.connection.subscribe(song_queue.player);

	song_queue.player.on(AudioPlayerStatus.Idle, () => {
		song_queue.songs.shift();
        video_player(guild, song_queue.songs[0], client, message);
	});

	song_queue.player.on("error", (err) => {
		song_queue.connection.destroy();
		client.queue.delete(guild.id);
		client.isReadyForTextToSpeech = true;
		return message.channel.send({ content:"There was an error loading the track." });
	});

	message.channel.send(`🎶 Now playing **${song.song.title}**`);
}

module.exports = {
	name: 'play',

	async run (client, message, args) {
		const queue = client.queue.get(message.guild.id);
		
		if(!queue) {
			const connection = joinVoiceChannel({
				channelId: message.member.voice.channel.id,
				guildId: message.guild.id,
				adapterCreator: message.guild.voiceAdapterCreator,
                channel: message.channel
			});
	
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				}
			});

			message.channel.send({ content:"Loading Track." });

			const song = await song_constructor (args.join(" "), message);

			if(song === "NO Song found!") return message.channel.send({ content: "No Song found!" });
			client.isReadyForTextToSpeech = false;

			const queue_constructor = {
				voice_channel: message.member.voice.channel.id,
				connection: connection,
				player: player,
				songs: []
			}

			queue_constructor.songs.push(song);
			client.queue.set(message.guild.id, queue_constructor);

			video_player(message.guild, queue_constructor.songs[0], client, message);
		} else {
			message.channel.send({ content:"Loading Track." });

			const song = await song_constructor (args.join(" "), message);

			if(song === "NO Song found!") return message.channel.send({ content: "No Song found!" });
			
			queue.songs.push(song);
			
			message.channel.send({ content:`:clock1: Queued **${song.song.title}**` });
		}
	}
}