import guildModel from "../../schemas/guild.js";

import { Guild, ApplicationCommandDataResolvable } from "discord.js";
import Client from "../../types/client.js";

module.exports = async (client: Client<true>, guild: Guild) => {
    console.info("Deleting MongoDB entry for guild " + guild.name);
    guildModel.findOneAndDelete({ guildId: guild.id }, () => { });
}
