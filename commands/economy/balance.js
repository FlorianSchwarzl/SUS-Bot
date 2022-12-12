module.exports = {
    name:"balance",
    description:"Shows the balance of your money",
    aliases: ["bal"],
 
    run (inputtedbot, email, variables, databases, benutzername, isASlashCommand) {
        email.channel.send("You have " + benutzername.economy.wallet + " gold in your wallet and " + benutzername.economy.bank + " gold in your bank");
    }

}