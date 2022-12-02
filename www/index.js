const express = require('express');
const fs = require("fs");

const app = express();

const files = fs.readdirSync(`${__dirname}/routes`);

for (const file of files) {
    if(!file.endsWith("js")) continue;
    const filePath = file.split(".")[0];
    app.use(`/${filePath}`, require(`./routes/${file}`));
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

let client;

module.exports = {
    startServer: (_client, port, callback) => {
        app.listen(port, callback);
        client = _client;
    }
}