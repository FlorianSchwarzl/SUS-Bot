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
        if(interaction) { 
            message.deferReply();
            message.channel = client.channels.cache.get(message.channelId);
        }

        client.player.addTrack(client, message, args);

        if(interaction) message.followUp("OK");
    }
}