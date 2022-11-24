const { MessageEmbed } = require("discord.js");

const after = (client, message, msg, start, slash = false) => { 
    const EndDate = Date.now();
    const embed = new MessageEmbed()
        .setColor("DARK_RED")
        .setTitle(`Pong!`)
        .addFields({name:"Message Latency", value:`${Math.floor(EndDate - start)}ms`},
            {name:"API Latency", value:`${Math.round(client.ws.ping)}ms`})
        .setTimestamp(new Date);
    
    if(!slash) {
        msg.delete();
        message.channel.send({embeds:[embed]});
    } else {
        message.followUp({embeds:[embed]});
    }
}

module.exports = {
    name: "ping",
    description: "latency",
    run: async (client, message, args, slash = false) => {
        const sendObj = {embeds:[new MessageEmbed().setColor(`#fff`).setDescription(`Please Wait...`)]};
        const StartDate = Date.now();
        if(slash) {
            await message.deferReply();
            message.followUp(sendObj).then(msg => {
                after(client, message, msg, StartDate, true);
            });
        } else {
            message.channel.send(sendObj)
            .then((msg) => after(client, message, msg, StartDate));
        }
    }
}