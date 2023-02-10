import Client from "../../types/client";

module.exports = (client: Client<true>) => {
	client.user.setActivity(`${client.config.prefix}help`);
	console.success("Bot is ready!");
};
