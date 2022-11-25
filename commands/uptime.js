const { MessageEmbed } = require('discord.js');

const duration = (ms) => {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (60 * 1000)) % 60).toString();
    const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
    const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
    return `\`${days}Days\`,\`${hrs}Hours\`,\`${min}Minutes\`,\`${sec}Seconds\``;
}

module.exports = {
    "name": "uptime",
    "description": "",

    run: async (client, message, args, slash) => {
        const channel = slash? client.channels.cache.get(message.channelId):message.channel;
        if(slash) {
            message.reply("ok");
        }

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
  
        const uptime = new MessageEmbed()
            .setColor("#fff7f7")
            .setDescription(` \`\📝\`\ | **__Uptime:__**`)
            .addFields({ name:"**Tage:**", value: `${days}` },
                { name:"**Stunden:**", value: `${hours}` }, 
                { name:"**Minuten:**", value: `${minutes}` },
                { name:"**Sekunden:**", value: `${seconds}` });
        channel.send({embeds:[uptime]});
    }
}