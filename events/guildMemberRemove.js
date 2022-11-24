const { goodbyeMessages, goodbyeChannel } = require("../config");
const centerText = require("../function/centerText.js");
const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const rounded = require("../function/rounded");
const circle = require("../function/circle");
const color = require("../function/color");
const blur = require("../function/blur");

module.exports = async (client, member) => {
    const channel = client.channels.cache.get(goodbyeChannel);
	const guild = client.guilds.cache.get(channel.guild.id);
	const user = client.users.cache.get(member.user.id);
	
	const canvas = createCanvas(700 * 3, 250 * 3);
	let ctx = canvas.getContext('2d');

	ctx = rounded(ctx, 0, 0, 700 * 3, 250 * 3, 250 * 3 / 15);
	ctx.clip();

	ctx.font = "90px Arial";
	ctx.fillStyle = "#ffffff";
	
	ctx.drawImage(await loadImage(await blur(`${__dirname}/../assets/background.png`, 5)), 0, 0, 700 * 3, 250 * 3);
	ctx.drawImage(await loadImage(await circle(await color("#444444"))), 100, 100, 550, 550);
	ctx.drawImage(await loadImage(await circle(user.displayAvatarURL({ dynamic: false, format: 'png' }))), 135, 135, 480, 480);

	ctx = centerText(ctx, `${user.username}#${user.discriminator}`, 630, 300, 2100, true);
	ctx = centerText(ctx, goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)], 630, 400, 2100, true);
	
	ctx.font = "60px Arial";
	ctx.fillText(`member #${guild.memberCount}`, 1700, 685);

	channel.send({ files:[new MessageAttachment(canvas.toBuffer(), `welcome_${user.username}.png`)] });
}