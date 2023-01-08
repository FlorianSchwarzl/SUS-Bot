module.exports = async (messageToSend, command, client, message, args, isInteraction, guildData, userData, isDM) => {
    let sentMessage;

    if (messageToSend.announce || isDM)
        messageToSend.ephemeral = false;
    else
        messageToSend.ephemeral = true;

    if (messageToSend.deleteMessage && !isInteraction) message.delete();

    if (messageToSend.ephemeral && isInteraction) messageToSend.deleteReply = false; // ephemeral messages can't be deleted

    if (messageToSend.disableMentions) messageToSend.allowedMentions = { parse: [] };

    messageToSend.failIfNotExists = false;

    if (isDM) {
        sentMessage = await message.author.send(messageToSend);
    }
    else
        sentMessage = await message.reply(messageToSend);

    if (messageToSend.deleteReply) {
        if (messageToSend.deleteReply === true) messageToSend.deleteReply = 5;
        setTimeout(() => {
            if (isInteraction) message.deleteReply();
            else sentMessage.delete();
        }, messageToSend.deleteReply * 1000);
    }

    if (messageToSend.disable) {
        if (messageToSend.disable === true) messageToSend.disable = 5;
        setTimeout(() => {
            messageToSend.components.forEach(actionRow => {
                actionRow.components.forEach(component => {
                    component.setDisabled(true);
                });
            });
            if (isInteraction) message.editReply(messageToSend);
            else sentMessage.edit(messageToSend);
        }, messageToSend.disable * 1000);
    }
}