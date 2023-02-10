import { Schema, model } from "mongoose";

const guildSchema = new Schema({
	_id: Schema.Types.ObjectId,
	guildId: String,

	channels: {
		welcome: String,
		goodbye: String,
		counter: String,

		allowed: [
			String
		],
	},

	counter: {
		current: Number,
		lastId: String
	},

	warns: [
		{ userId: String, count: Number }
	],

	tempBans: [
		{ userId: String, endDate: Date }
	]
});

export default model("guild", guildSchema, "guilds");

export interface GuildScheme {
	_id: Schema.Types.ObjectId;
	guildId: string;

	channels: {
		welcome: string;
		goodbye: string;
		counter: string;

		allowed: string[];
	};

	counter: {
		current: number;
		lastId: string;
	};

	warns: {
		userId: string;
		count: number;
	}[];

	tempBans: {
		userId: string;
		endDate: Date;
	}[];
}
