/** 
 * Config file for nonsensitive data
 */

import Client from "./types/client";

module.exports.prefix = process.env.PREFIX;
module.exports.fetchData = require("./functions/fetchDataFromSave");

module.exports.authorsString = "";
const { authors } = require("./package.json");
authors.forEach((author: string, index: number) => {
	if (index === authors.length - 1) module.exports.authorsString += `and ${author}`;
	else module.exports.authorsString += `${author}, `;
});
module.exports.authorsString = module.exports.authorsString.replace(/, and/, " and");
module.exports.version = require("./package.json")["version"];

module.exports.embedFooter = (client: Client<true>): { text: string } => {
	return { text: `Running as ${client.user.tag} on version ${module.exports.version} of the SUS-Bot by ${module.exports.authorsString}` };
};

export default module.exports;