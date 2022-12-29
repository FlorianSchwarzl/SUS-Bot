module.exports = async (returnValue) => {
    if (returnValue instanceof Promise) {
        const timeout = setTimeout(() => {
            throw new Error("Command took too long to execute!");
        }, 4500);
        returnValue = await returnValue;
        clearTimeout(timeout);
    }
    if ((typeof returnValue === "string" && returnValue !== "")
        || returnValue?.embeds !== undefined
        || returnValue?.files !== undefined
        || returnValue?.components !== undefined
        || returnValue?.content !== undefined) {
        if (typeof returnValue === "string") returnValue = { content: returnValue };
        returnValue.ephemeral = true;
    } else throw new Error(`Command returned nothing.`);
    return returnValue;
}