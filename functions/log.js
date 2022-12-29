const fs = require("fs");
const { StringUtil } = require("sussyutilbyraphaelbader");

module.exports = class {
    typeLength = 0;
    filePath = "";
    startISO8601;

    constructor(filePath, typeLength) {
        this.startISO8601 = new Date().toISOString();
        while (filePath.endsWith("/")) {
            filePath = filePath.slice(0, -1);
        }
        this.filePath = filePath + "/" + this.startISO8601 + ".log";
        this.filePath = this.filePath.replace(/:/g, "-");
        this.clear();
        this.typeLength = typeLength;
    }

    append = (type, ...messages) => {
        let ISO8601 = new Date().toISOString();
        let typeString = "[" + type.toUpperCase() + "]";
        typeString = StringUtil.rpad(typeString, this.typeLength, " ");
        messages.forEach((message, index) => {
            if (message instanceof Error) {
                messages[index] = message.stack.replace(/^Error: /g, "");
            } else if (typeof message !== "string") {
                messages[index] = JSON.stringify(message);
            }
        });
        const message = messages.join(" ");
        let logMessage = `[${ISO8601}] ${typeString} ${message}`;
        fs.appendFile(this.filePath, logMessage + "\n", (err) => {
            if (err) console.debug(err);
        });
    }

    clear = () => {
        fs.writeFile(this.filePath, "", (err) => {
            if (err) console.debug(err);
        });
    }

    info = (...messages) => {
        this.append("info", ...messages);
    }

    warn = (...messages) => {
        this.append("warn", ...messages);
    }

    error = (...messages) => {
        this.append("error", ...messages);
    }

    debug = (...messages) => {
        this.append("debug", ...messages);
    }

    log = (...messages) => {
        this.append("log", ...messages);
    }

    success = (...messages) => {
        this.append("success", ...messages);
    }
}