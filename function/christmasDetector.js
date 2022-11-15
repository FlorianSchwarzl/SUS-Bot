const { christamsShit } = require("../config");

module.exports = (message) => {
    return christamsShit.some(e => message.content.includes(e));
}