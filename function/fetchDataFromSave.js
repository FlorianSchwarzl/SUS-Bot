const { Console } = require('console');
const fs = require('fs');

let data = require("../data.json");

module.exports = {
    all: () => {
        return data;
    },
    get: (key) => {
        return data[key];
    },
    set: (key, value) => {
        data[key] = value;
        console.log(`Set ${key} to ${value}`);
    },
    write: () => {
        const wStream = fs.createWriteStream("./data.json", "utf-8");
        wStream.write(JSON.stringify(data));
        wStream.end();
        console.log("Wrote data to file: " + JSON.stringify(data));
    }
}