const userList = require("../../schemas/user");
module.exports = {
    name:"work",
    description:"Work to earn money",
    aliases: ["wk"],
 
    run (inputtedbot, email, variables, databases, benutzername, isASlashCommand) {
        let earned = Math.round(Math.random()*400)+100;
        benutzername.economy.wallet += earned;
        userList.findByIdAndUpdate(benutzername._id, { economy: benutzername.economy }, (err, data) => { });
        email.channel.send("Congratulations! You earned " + earned +  " gold. \nNow you have: " + benutzername.economy.wallet + "!");

    }

}