/** 
 * Config file for nonsensitive data
 */

const fetchDataFromSave = require('./function/fetchDataFromSave.js');

module.exports.christmasShit = ["christmas", "Weihnachten"];
module.exports.prefix = process.env.PREFIX;
module.exports.fetchData = require("./function/fetchDataFromSave.js");
module.exports.embedFooter = (client) => ({ text: `Running as ${client.user.tag} on version ${require("./package.json")["version"]} of the SUS-Bot by ${require("./package.json")["author"]}` });