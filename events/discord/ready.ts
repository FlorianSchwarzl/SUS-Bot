import Client from "../../types/client.js";

module.exports = (client: Client<true>) => {
    client.user.setActivity(`${client.config.prefix}help`);
    // @ts-expect-error // it really does...
    console.success("Bot is ready!");
}