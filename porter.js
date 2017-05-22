/**
 * Created by Flynn Buckingham (https://github.com/flynnham) on 21/05/17.
 */

/*
* A node.js/ES5 script for converting neofetch-like ascii art into JSON form
*
* - this script is intended to be using with https://swlinux.org, but can be implemented and used under
* the MPL 2.0 licence
*
* */

function asciiPorter(dataString){
    var rawData = dataString.split(/(?:\r\n|\r|\n)/g),
        outData =[],
        output = {};// split at any return characters

    rawData.forEach((item) => {
        item.split(/(\s+)/).forEach((itemNode) => { // check for repeating spaces vs chracters
            if (!itemNode.replace(/\s/g, '').length) { // check if the node is empty (including whitespace)
                if (itemNode.length > 0) outData.push(itemNode.length); // only push if has more than one space
            } else {
                outData.push(itemNode);
            }
        });
        outData.push(0); // add breakline
    })

    outData.pop(); // remove last 0 (breakline) from the output

    output.heavy = JSON.stringify(outData)
        .replace(/,\d+,0,/g, ',0,'); // removes tailing whitespace (ex: [,,100,0,,,] removes 100)

    ; //.push(itemNode.replace(/"/g, "'"));

    /* below is a super hacky solution for repeat character compression - basically I'm too dumb to come up with a more elegant solution;

     * - first regex finds any series of repeating single chracters with a length greater than 3, and places it into an array object literal
     * - the second regex finds any brackets that are mis parsed ]`
     * - third regex removes any empty array elements (including simple empty strings in the JSON object
     *
     * ugly: yes, scary: yes, does it work: also yes
     *
     * JUST A NOTE: this form of compression only has benefits when used with ASCII art with many repeating characters, and will have negligible
     * effectiveness if used with a file with many short repeating strings
     *
     * */
    var COMPRESSION_FACTOR = 3, // the minimum of repeating string the regex will need before replacement (3 is strongly recommended)
        compressor = new RegExp('(.)\\1{' + COMPRESSION_FACTOR + ',}', 'g');

    output.compressed = output.heavy
        .replace(compressor, (match) =>{return '\",[' + match.length + ',\"' + match[0] + '"\]"';}) // array replace
        .replace(/\"\]\"/g, '"],"') // broken array fix
        .replace(/\,\"\"\,/g, ','); // empty string removal

    return output;
}

if (typeof module !== "undefined") module.exports = asciiPorter;