const fs = require('fs');

module.exports = getFiles = (dir, exclude = null) => {
    const output = {};
    fs.readdirSync(dir).forEach(path => {
        if (fs.lstatSync(dir + "/" + path).isDirectory()) {
            output[path] = getFiles(dir + "/" + path, exclude);
        } else {
            const func = require(`.${dir}/${path}`);
            output[path.replace(".js", "")] = func;
        }
    });
    return output;
}