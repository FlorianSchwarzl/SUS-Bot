const data = require("../data.json");

module.exports = {
    all: () => {
        return data;
    },
    get: (key: string) => {
        return data[key];
    },
    set: (key: string, value: any) => {
        data[key] = value;
    },
    write: () => {
        const wStream = fs.createWriteStream("./data.json", "utf-8");
        wStream.write(JSON.stringify(data));
        wStream.end();
    }
}
