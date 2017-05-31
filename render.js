/**
 * Created by Flynn Buckingham (https://github.com/flynnham) on 21/05/17.
 *
 * A simple renderer for converting Ascii data (as to be implemented on https://swlinux.org)
 *
 */

// should set to const -> but es5
var validColorCodes = [1,2,3,4,5,6,7,8,9]; // define what colors are rendered as valid vs non valid - should match templating regex

function asciiRender(dataArray, style){
    if (typeof dataArray === "boolean"){
        // shorthand rule for returning readonly valid color Array for rendering.
        return validColorCodes
    }
    if (typeof style !== "object") style = {};

    // the default font color rendering
    var i = validColorCodes.length,
        colorClass = {}, // where classes are stored if set
        colorName;

    if (typeof style.single === "string"){
        // override all colors and only use the color
        while (i--){
            style['c' + validColorCodes[i]] = style.single; // set as single color
        }
    } else {
        while (i--){
            colorName = 'c' + validColorCodes[i];
            if ((typeof style[colorName] === "string")){
                // it's a string - but is it a class-name?
                if (style[colorName][0] === '.'){
                    // it' a class -> add to the class-storage
                    colorClass[colorName] = style[colorName].substring(1); // remove dot
                    style[colorName] = '';
                } else {
                    // its' just a string- assume it's a color
                    colorClass[colorName] = '';
                    style[colorName] = style[colorName];
                }
            } else {
                style[colorName] = '#000';
            }
        }
    }

    // change rendering if style.block is set (only use first char)
    var renderBlock = (typeof style.block === "string") ? style.block[0] : null;

    // treat as single output
    var outputString = '',
        dataNode, i = 0;

    // build the string from the data array
    for (i; i < dataArray.length; i++) {
        dataNode = dataArray[i];
        switch (typeof dataNode) {
            case "string":
                // if renderBlock is set, then replace the string's characters (excluding color nodes) with the character; otherwise just send the raw data through
                outputString += (renderBlock) ? dataNode.replace(/(\${c\d+})|./g, function (m0, m1){
                    return (m1) ? m1 : renderBlock; // only match second match group (which is any group matching the ${c\d} pattern.
                }) : dataNode; // or simply returns string since renderBLock is not set
                break;
            case "number":
                // if the dataNode is simply "0", treat it as a breakline, otherwise, treat it as whitespace
                outputString += (dataNode > 0) ? ' '.repeat(dataNode) : '<br />';
                break;
            case "object":
                if (typeof dataNode.length !== "undefined") {
                    // repeat renderBlock (if it is set) or repeat the array defined value
                    outputString += ((renderBlock) ? renderBlock : dataNode[1]).repeat(dataNode[0])
                } else {
                    console.warn('invalid render syntax, ignoring');
                }
                break;
            default:
                // because why not
                break;
        }
    }

    var generateClassAttribute = function(key){
        if (typeof colorClass[key] !== "undefined" && colorClass[key].length) return 'class="' + colorClass[key] + '" ';
        return ''; // it's not a class so ignore
    }

    var generateEndStyle = function(key){
        if (style[key].length) return 'style="color:' + style[key] + '"';
        return ''; // it's not a class so ignore
    }

    // replace the output so the templating
    var numSpans = 0;

    outputString = outputString.replace(/\$\{c\d+\}/g, (match) => {
        numSpans++; // increment span counter so we have a rough idea as to whether we need to add closure
        var matchString = match.replace(/\$\{|}/g, ''); // get the value thats between the markers (i.e ${ + val + }

        return (typeof style[matchString] === "string") ? '</span><span ' + generateClassAttribute(matchString) + generateEndStyle(matchString) + '>' : '';

    }).replace('</span>', ''); // get rid of the first orphan span close tag
    // just dump the entire HTML string (recommended)

    if (numSpans) outputString += '</span>'; // adds closure if span tags are present
    
    return outputString
}

if (typeof module !== "undefined") module.exports = asciiRender;
