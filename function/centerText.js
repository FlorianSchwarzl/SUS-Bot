const shortenText = require('./shortenText');

/**
 * 
 * @param {canvas} ctx 
 * @param {String} text 
 * @param {number} startingX 
 * @param {number} startingY 
 * @param {number} maxWidth 
 * @param {Boolean} shorten 
 * @param {Boolean} onlyCoordinates 
 * @returns 
 */

module.exports = (ctx, text, startingX, startingY, maxWidth, shorten = false, onlyCoordinates = false) => {
    const width = ctx.measureText(text).width;
    if (width > maxWidth - startingX && !shorten) throw new Error('to little space');
    else if (width > maxWidth - startingX) text = shortenText(ctx, text, maxWidth - startingX);
    
    if (onlyCoordinates && shorten) return { x:startingX + (maxWidth - startingX - ctx.measureText(text).width), y: startingY, text: text }
    else if (onlyCoordinates && !shorten) return { x:startingX + (maxWidth - startingX - ctx.measureText(text).width), y: startingY }

    ctx.fillText(text, startingX + (((maxWidth - startingX) - ctx.measureText(text).width) / 2), startingY);

    return ctx;
}