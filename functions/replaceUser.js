module.exports = (message, member) => {
    return message.replace("{user}", "**" + member.user.username + "#" + member.user.discriminator + "**");
}
