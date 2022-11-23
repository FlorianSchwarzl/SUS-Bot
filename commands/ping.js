const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",

    run: (client, message, args) => {
        const StartDate = Date.now();
        
        message.channel.send({embeds:[new MessageEmbed()
            .setColor(`#fff`)
            .setDescription(`Please Wait...`)]}).then(Msg => { 
            const EndDate = Date.now();
            
            const embed = new MessageEmbed()
                .setColor("DARK_RED")
                .setTitle(`Pong!`)
                .addFields({name:"Message Latency", value:`${Math.floor(EndDate - StartDate)}ms`},
                    {name:"API Latency", value:`${Math.round(client.ws.ping)}ms`})
                .setTimestamp(new Date);
            
            Msg.delete();
            message.channel.send({embeds:[embed]});
        });
    }
}