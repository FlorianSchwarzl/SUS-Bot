module.exports = {
    name: "flip",
    aliases: ["coinflip", "coin", "skyrim"],
    description: "flips a coin",
    options: {
        name: "headsTails",
        type: "STRING",
        description: "select heads or tails",
        required: false,
    },

    run(client, message, args, guildData, userData, isSlashCommand) {
        const coinArray = ["heads", "tails"];
        let numberThrow = Math.floor(Math.random() * 2);
        message.channel.send(coinArray[numberThrow]);
        if (!(args[0] === `heads`) && !(args[0] === 'tails')) {
            return;
        }
        else {

            if (args[0] === coinArray[numberThrow]) {
                return "You are victorious!";
            }
            else {
                return "You are loser!";
            }
        }
    }

}
