module.exports = {
    name: "guess",
    aliases: ["number", "numberguess"],
    description: "guess a number between 1 and the specified number",
    options: [
        {
            name: "number",
            type: "number",
            description: "the specified number",
            required: true,
        },
        {
            name: "guess",
            type: "number",
            description: "the guessed number",
            required: true,
        }
    ],

    run(client, message, args, guildData, userData, isSlashCommand) {
        const number = Math.round(Math.random() * args[0] - 1) + 1;
        message.channel.send("Number was generated! The number is: " + number);

        if (number == args[1]) {
            message.channel.send("You're number is correct!");
        }
        else {
            message.channel.send("You're number is false!");
        }

    }

}
