/**
 * Created by Flynn Buckingham (https://github.com/flynnham) on 18/05/17.
 */

var fs = require('fs');
var path = require('path');
var porter = require('./porter');

var args = process.argv.slice(2), // crush any params that aren't relevant
    filepath = args.pop(); // get dat last argument

if (typeof filepath === "undefined") return 0; // return leaving the user confused

var joinPath = path.join(process.cwd(), filepath); // assuming file is relative to working directory

if (fs.existsSync(joinPath)) {
    // we can do the processing now

    var rawData = fs.readFileSync(joinPath, 'utf-8'),
        output = porter(rawData);

    console.log(`HEAVY RESULT: \n ${output.heavy}\n`);
    console.log(`COMPRESSED RESULT: \n ${output.compressed}\n`);
    
} else {
    console.error('file does not exist!'); // that was easy
    return 0; // because why not
}
