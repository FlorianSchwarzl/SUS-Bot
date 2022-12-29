const logFile = new (require("./log.js"))("logs", 9);

module.exports = (con) => {
    con.success = con.log;

    require("console-stamp")(con, {
        format: ':date([HH:MM:ss.l])',
        include: ['info', 'warn', 'error', 'debug', 'success', 'log'],
        levels: {
            error: 1,
            warn: 2,
            info: 3,
            log: 4,
            debug: 4,
            success: 4
        }
    });

    const consoles = [con.info, con.warn, con.error, con.debug, con.success, con.log];
    con.info = (...args) => {
        consoles[0]("\u001b[36m", ...args, "\u001b[0m");
    }
    con.warn = (...args) => {
        consoles[1]("\u001b[33m", ...args, "\u001b[0m");
        logFile.warn(...args);
    }
    con.error = (...args) => {
        consoles[2]("\u001b[31m", ...args, "\u001b[0m");
        logFile.error(...args);
    }
    con.debug = (...args) => {
        consoles[3]("\u001b[35m", ...args, "\u001b[0m");
    }
    con.success = (...args) => {
        consoles[4]("\u001b[32m", ...args, "\u001b[0m");
        logFile.success(...args);
    }
    con.log = (...args) => {
        consoles[5]("\u001b[37m", ...args, "\u001b[0m");
        logFile.log(...args);
    }
}