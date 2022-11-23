const fs = require('fs');

let data = require("./data.json");

module.exports = {
    all: () => {
        return data;
    },
    get: (key) => {
        return data[key];
    },
    set: (key, value) => {
        data[key] = value;
    },
    write: () => {
        fs.writeFileSync("./data.json", JSON.stringify(data));
    }
}