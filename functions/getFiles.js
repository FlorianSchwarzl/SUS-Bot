const util = require('util');
const fs = require("fs");

module.exports = util.deprecate(getFiles = (dir, exclude = null) => {
    const output = {};
    fs.readdirSync(dir).forEach(path => {
        if (fs.lstatSync(dir + "/" + path).isDirectory()) {
            output[path] = getFiles(dir + "/" + path, exclude);
        } else {
            const func = util.deprecate(require(`.${dir}/${path}`), "Your nodejs version does not support this version of EcmaScript.");
            output[path.replace(".js", "")] = func;
        }
    });
    return output;
}, "Your nodejs version does not support this version of EcmaScript.");