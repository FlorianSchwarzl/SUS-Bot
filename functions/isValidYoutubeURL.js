const validQueryDomains = new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "gaming.youtube.com",
]);

const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
const idRegex = /^[a-zA-Z0-9-_]{11}$/;

const getURLVideoID = link => {
    const parsed = new URL(link.trim());
    let id = parsed.searchParams.get("v");
    if (validPathDomains.test(link.trim()) && !id) {
        const paths = parsed.pathname.split("/");
        id = parsed.host === "youtu.be" ? paths[1] : paths[2];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
        throw Error("Not a YouTube domain");
    }
    if (id === void 0) {
        throw Error(`No video id found: "${link}"`);
    }
    id = id.substring(0, 11);
    if (!exports.validateID(id)) {
        throw TypeError(`Video id (${id}) does not match expected ` +
            `format (${idRegex.toString()})`);
    }
    return id;
};


module.exports.validateURL = string => {
    try {
        getURLVideoID(string);
        return true;
    } catch (e) {
        return false;
    }
};
