module.exports = {
    name:"economyTest",
    description:"Testing the economy",
    aliases: ["work"],
 
    run (client, message, args, guildData, slash) {
        let earned = Math.round(Math.random()*400)+100;
        guildData.economy[message.member.id].balance += earned;
        message.channel.send()

    }

}