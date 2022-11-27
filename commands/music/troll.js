module.exports = {
    name: 'troll',
    aliases: ['t'],
    category: 'Music',
    description: "A wild troll appeared.",

    run(client, message, args, slash) {
        if(slash) message.reply({ content: 'trollololoolololo', ephemeral: true });
        else message.delete();
        
        client.player.troll(message);
    },
};