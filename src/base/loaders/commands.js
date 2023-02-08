const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);


module.exports = {
    async getCommands(client) {
      var commands = {};
      var count = 1; //For fun, let's count how many files we load

      var triggers = [];

      //Go through all the folders (modules)
      var files = await readdir(`./src/commands/`); 

      //Loop all of the commands in the modules
      for(var x = 0; x < files.length; x++) {
        var file  = files[x];
        
        if(!file.endsWith('.js')) { return; }
        var inc   = require(`../../commands/${file}`);
        commands[file] = new inc(client);

        commands[file].setClient(client);
        
        var config = commands[file].getConfig();
        //Exit if there is no trigger
        if(!config.info.name) { return; }
        
        
        //Triggers
        if(triggers.includes(config.info.trigger)) {
          console.error(`${count}> [TRIGGER ERROR] Conflict in /commands/${file}`);
          process.exit(1);
        }

        triggers.push(config.info.name);

        //Trigger aliases
        if(config.info.aliases) {
          for(var a = 0; a < config.info.aliases.length; a++) {
            var alias = config.info.aliases[a];
            if(triggers.includes(alias)) {
              console.error(`${count}> [ALIAS ERROR] Conflict in /commands/${file}`);
              process.exit(1);
            }

            triggers.push(alias);
          }
        }
        

        console.log(`${count}> /commands/${file}`);
        count++;
      }
        

      client.loadCommands(commands);
      return commands;
    }
}