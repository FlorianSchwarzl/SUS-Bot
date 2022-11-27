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
            message.reply("ok");
        }

        client.player.addTrack(client, message, args);
    }
}