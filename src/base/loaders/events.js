'use strict'

const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

/*
    Event Handler
    Scans the ./events folder for .js files to include,
    then returns the event information back to the caller
*/
module.exports = {
    async getEvents(client) {
        var events = {};
        var count = 1; //For fun, let's count how many files we load
        var files = await readdir(`./src/events/`); 

        /*
            Looping through the folders of /events
            Will not add *.js files yet
        */
        for(var x = 0; x < files.length; x++) {
        var file  = files[x];
        
        if(file.endsWith('.js')) { 
            var inc   = require(`../../events/${file}`);
            events[file] = new inc(client);
            console.log(`${count}> /events/${file}`);
            count++;
        }
        }
        return events;
    }
}