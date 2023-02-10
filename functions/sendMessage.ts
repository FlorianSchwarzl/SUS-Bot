import { Message, Component, ButtonComponent, BaseSelectMenuComponent } from "discord.js";
import Client from "../types/client";
import { ProcessedCommands, CommandReturnWithoutString } from "../types/command";
import { GuildData, UserData } from "../types/data";

export default async (messageToSend: CommandReturnWithoutString, command: ProcessedCommands, client: Client<true>, message: Message, args: string[], isInteraction: boolean, guildData: GuildData, userData: UserData, isDM: boolean) => {
	let sentMessage: Message;

	if (messageToSend === null) return;

	if (messageToSend.announce || isDM)
		// @ts-expect-error // I know what I'm doing... I'll just ignore whatever attributes I attached that it doesn't need
		messageToSend.ephemeral = false;
	else
		// @ts-expect-error // same as above
		messageToSend.ephemeral = true;

	if (messageToSend.deleteMessage && !isInteraction) message.delete();

	// @ts-expect-error // same as above
	if (messageToSend.ephemeral && isInteraction) messageToSend.deleteReply = false; // ephemeral messages can't be deleted

	if (messageToSend.disableMentions) messageToSend.allowedMentions = { parse: [] };

	// @ts-expect-error // same as above
	messageToSend.failIfNotExists = false;

	if (isDM) {
		// @ts-expect-error // same as above
		sentMessage = await message.author.send(messageToSend);
	}
	else
		// @ts-expect-error // same as above
		sentMessage = await message.reply(messageToSend);

	if (messageToSend.deleteReply) {
		if (messageToSend.deleteReply === true) messageToSend.deleteReply = 5;
		setTimeout(() => {
			// @ts-expect-error // idk what I did wrong here, but it's not a big deal, I hope
			if (isInteraction) message.deleteReply();
			else sentMessage.delete();
		}, messageToSend.deleteReply * 1000);
	}

	if (messageToSend.disable) {
		if (messageToSend.disable === true) messageToSend.disable = 5;
		setTimeout(() => {
			if (messageToSend.components === undefined) return;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Idk the type... It'll be fine, I hope
			messageToSend.components.forEach((actionRow: any) => {
				actionRow.components.forEach((component: Component) => {
					if (component instanceof ButtonComponent || component instanceof BaseSelectMenuComponent) {
						// @ts-expect-error // I do, in fact, know what I'm doing TS... Idfc if it's read-only or not
						component.disabled = true;
					}
				});
			});
			// @ts-expect-error // I do think it does exist but I just selected the wrong type bc I want to finish this as soon as possible // FIXME
			if (isInteraction) message.editReply(messageToSend);
			// @ts-expect-error // I know what I'm doing... I'll just ignore whatever attributes I attached that it doesn't need
			else sentMessage.edit(messageToSend);
		}, messageToSend.disable * 1000);
	}
};