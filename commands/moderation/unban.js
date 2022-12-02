const { BanMembers } = require("../../enums/permissionBitField");
const { BanMembers: banMbs } = require("../../enums/permissionStrings");

module.exports = {
    name: 'unban',
    description: "Unban a user",

    options: [
        {
            name: "user",
            type:"USER",
            description: "user you want to change the nickname of",
            required: true,
        }    
    ],

    default_member_permissions: banMbs,

    run: async (client, message, args, slash) => {
        message.delete();

        if (!slash) {
            if (!message.member.permissions.has(BanMembers)) {
                return message.channel.send("You don't the required permissions to use this command.");
            }
        } else {
            message.reply({ content: 'ok', ephemeral: true });
        }

        if (!args[0])
            return message.channel.send(`Please Give Me Member ID That You Want To Unban!`);
        
        const bans = await message.guild.bans.fetch();
        const member = bans.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase() ) || bans.get(args[0]) || bans.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());

        if (!member)
            return message.channel.send("Please Give Valid Member ID Or Member Is Not Banned!");

        try {
            await message.guild.members.unban(member.user.id, Reason);
            message.channel.send(`Unbanned <@!${args[0]}>. With reason: ${args.slice(1) || "No Reason Provided!"}`);
        } catch (error) {
            return message.channel.send(`I Can't Unban That Member Maybe Member Is Not Banned Or Some Error!`);
        }
    }
}