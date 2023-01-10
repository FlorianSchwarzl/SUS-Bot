module.exports = (seconds) => {
    const timeObj = secondsConverter(seconds, "sec");
    let returnString = "";
    if (timeObj.days > 0)
        returnString += `${timeObj.days}d`;
    if (timeObj.hours > 0)
        returnString += `${timeObj.hours}h`;
    if (timeObj.minutes > 0)
        returnString += `${timeObj.minutes}m`;
    if (timeObj.seconds > 0)
        returnString += `${timeObj.seconds}s`;
    if (returnString !== "")
        return returnString;
    else
        return "0s";
}

function secondsConverter(seconds) {
    const timeObj = {};
    timeObj.days = Math.floor(seconds / 86400);
    seconds -= timeObj.days * 86400;
    timeObj.hours = Math.floor(seconds / 3600);
    seconds -= timeObj.hours * 3600;
    timeObj.minutes = Math.floor(seconds / 60);
    seconds -= timeObj.minutes * 60;
    timeObj.seconds = seconds;
    return timeObj;
}