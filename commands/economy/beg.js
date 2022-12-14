const userList = require("../../schemas/user");

module.exports = {
    name: "beg",
    description: "Beg to earn money",
    cooldown: 60,

    run(client, message, args, guildData, userData, isSlashCommand) {
        if (userData.economy.wallet < 200) {
            message.channel.send("Not enough money to risk on losing");
        }
        else {
            if (userData.economy) {
                const earned = Math.round(Math.random() * 400) - 200;
                userData.economy.wallet += earned;
                userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
                userData.level.xp += 2;
                userList.findByIdAndUpdate(userData._id, { level: userData.level }, (err, data) => { });
                if (!(Math.floor(userData.level.xp / 50 /*0.5*/) === (Math.floor((userData.level.xp - 5) / 50) /*0.6*/))) {
                    message.channel.send(`<@${userData.userId}>` + " just levelled up!")
                }

                if (earned < -100) message.channel.send("You were stolen from. You lost " + Math.abs(earned));
                else if (earned < 0) message.channel.send("You were stung by a bee and lost " + Math.abs(earned) + " gold");
                else if (earned > 100) message.channel.send("You found a purse. You got " + earned + " gold");
                else if (earned > 0) message.channel.send("You begged and got some money. You got " + earned + " gold");
                else message.channel.send("You are in perfect equilibrium. You neither gained nor lost money");
            }
        }
    }

}
