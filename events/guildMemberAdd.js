const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const blur = require('../function/blur');
const circle = require('../function/circle');
const roundRect = require("../function/rounded");
const color = require("../function/color");
const path = require("path");

module.exports = async (client, member) => {
    // const channel = member.guild.channels.cache.get(member.guild.systemChannelID);
    const guild = member.guild;
    const user = client.users.cache.get(member.id);

    console.log(guild, user);
	
	const canvas = createCanvas(700 * 3, 250 * 3);
	let ctx = canvas.getContext('2d');

	ctx = new roundRect().getCTX(ctx, 0, 0, 700 * 3, 250 * 3, 250 * 3 / 15);
	ctx.clip();

	ctx.font = "90px Arial";
	ctx.fillStyle = "#ffffff";

    ctx.drawImage(await loadImage(await blur(path.resolve(`${__dirname}/../assets/canvas.png`), 5)), 0, 0, 700 * 3, 250 * 3);
	ctx.drawImage(await loadImage(await circle(await color("#444444"))), 100, 100, 550, 550);
	ctx.drawImage(await loadImage(await circle(user.displayAvatarURL({ dynamic: false, format: 'png' }))), 135, 135, 480, 480);
    
    ctx.font = "60px Arial";
	
	ctx.fillText(`member #${guild.memberCount}`, 1700, 685);

	channel.send({ files:[new MessageAttachment(canvas.toBuffer(), `welcome_${user.username}.png`)] });
}