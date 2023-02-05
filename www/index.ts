import Client from "../types/client";

const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.static(`${__dirname}/static/`));

const files = fs.readdirSync(`${__dirname}/routes`);

for (const file of files) {
	if (!file.endsWith("js")) continue;
	const filePath = file.split(".")[0];
	app.use(`/${filePath}`, require(`./routes/${file}`));
}

module.exports = {
	startServer: (client: Client<true>, port: number, callback: () => unknown) => {
		app.listen(port, callback);
	}
};