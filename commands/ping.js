const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",

    run: (client, message, args) => {
        const StartDate = Date.now();
        const Wait = new MessageEmbed()
            .setColor(`#fff`)
            .setDescription(`Please Wait...`);
        
        message.channel.send(Wait).then(Msg => { 
            const EndDate = Date.now();
            
            const embed = new MessageEmbed()
                .setColor(Color)
                .setTitle(`Pong!`)
                .addFields({name:"Message Latency", value:`${Math.floor(EndDate - StartDate)}ms`},
                    {name:"API Latency", value:`${Math.round(client.ws.ping)}ms`})
                .setTimestamp(new Date);
            
            Msg.delete();
            message.channel.send(embed);
        });
    }
}