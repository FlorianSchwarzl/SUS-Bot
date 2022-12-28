const { IsSomething } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "deposit",
    description: "Deposit money into your bank account",
    aliases: ["dep"],

    options: [
        {
            name: "amount",
            description: "max / Amount to deposit",
            type: "STRING",
            required: true
        }
    ],


    run: (_client, message, args, _guildInfo, userInfo) => {
        if (!args[0]) return "Please provide the amount you want to deposit.";

        const current = userInfo.economy;
        let moneys = current.wallet;

        if (args[0] === "max") {
            current.bank += current.wallet;
            current.wallet = 0;
        } else {
            if (!IsSomething.isNumber(args[0])) return "Please provide the amount you want to deposit as a number.";
            if (+args[0] > current.wallet) return "You do not have enough money to deposit " + args[0] + " gold.";
            current.bank += +args[0];
            current.wallet -= +args[0];
            moneys = +args[0];
        }

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });
        return `Deposited ${moneys} gold.`;
    }
}