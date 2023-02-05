import { Command } from "../../types/command";

const { StringUtil } = require("sussy-util");
const { EmbedBuilder, Colors, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
	description: "Search in a few places for money.",
	commandOptions: {
		cooldown: 60
	},

	run: (_client, _message, _args, _guildData, _userData) => {
		const places = [
			"bank",
			"river",
			"pocket",
			"car",
			"house",
			"garden",
			"street",
			"park",
			"school",
			"work",
			"shop",
			"gym",
			"hospital",
			"church",
			"library",
			"mall",
			"beach",
			"forest",
			"mountain",
			"cave",
			"farm",
			"factory",
			"office",
			"hotel",
			"museum",
			"zoo",
			"casino",
			"bar",
			"restaurant",
			"club",
			"parking lot",
			"bus stop",
			"train station",
			"airport",
			"police station",
			"fire station",
			"post office",
			"bank",
			"supermarket",
			"bakery",
			"butcher",
			"pharmacy",
			"hardware store",
			"bookstore",
			"clothing store",
			"jewelry store",
			"pet store",
			"toy store",
			"furniture store",
			"car dealership",
			"car repair shop",
			"car wash",
			"gas station",
			"laundry",
			"dry cleaner",
			"hair salon",
			"spa",
			"tattoo parlor",
			"barber shop",
			"dentist",
			"doctor",
			"optician",
			"veterinarian",
			"golf course",
			"bowling alley",
			"amusement park",
			"movie theater",
			"concert hall",
			"stadium",
			"aquarium",
			"circus",
			"casino",
			"bar",
			"restaurant",
			"club",
			"parking lot",
			"bus stop",
			"train station",
			"airport",
			"police station",
			"fire station",
			"post office",
			"bank",
			"supermarket",
			"bakery",
			"butcher",
			"pharmacy",
			"hardware store",
			"bookstore",
			"clothing store",
			"jewelry store",
			"pet store",
			"toy store",
			"furniture store",
			"car dealership",
			"car repair shop",
			"car wash",
			"gas station",
			"laundry",
			"dry cleaner",
			"hair salon",
			"spa",
			"tattoo parlor",
			"barber shop",
			"dentist",
			"doctor",
			"optician",
			"veterinarian",
			"golf course",
			"bowling alley",
			"amusement park",
			"movie theater",
			"concert hall",
			"stadium",
			"aquarium",
			"circus"];

		const actionRow = new ActionRowBuilder();

		const embed = new EmbedBuilder(true)
			.setTitle("Search")
			.setColor(Colors.Red)
			.setDescription("Where do you want to search?");

		const randomElements = places.sort(() => Math.random() - 0.5).slice(0, 5);

		randomElements.forEach(place => {
			const button = new ButtonBuilder()
				.setLabel(StringUtil.capitalize(place))
				.setCustomId(`search ${place}`)
				.setStyle(ButtonStyle.Primary);

			actionRow.addComponents(button);
		});

		return { embeds: [embed], components: [actionRow] };
	}
} as Command;