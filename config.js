/** 
 * Config file for nonsensitive data
 */

module.exports.prefix = process.env.PREFIX;
module.exports.fetchData = require("./functions/fetchDataFromSave.js");

module.exports.authorsString = "";
const { authors } = require("./package.json");
authors.forEach((author, index) => {
    if (index === authors.length - 1) module.exports.authorsString += `and ${author}`;
    else module.exports.authorsString += `${author}, `;
});
module.exports.authorsString = module.exports.authorsString.replace(/, and/, " and");
module.exports.version = require("./package.json")["version"];

module.exports.embedFooter = (client) => ({ text: `Running as ${client.user.tag} on version ${module.exports.version} of the SUS-Bot by ${module.exports.authorsString}` });