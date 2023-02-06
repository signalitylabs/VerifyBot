'use strict'

/*
    onChat
    Listens for all chat events, checks for command triggers, and passes
    chat message to other modules
*/
module.exports = class {
    constructor(client, db) {
        client.on('interactionCreate', async (interaction) => {
            //If we're in Dev Mode then only look in the testing channel
            if(process.env.DEV_MODE) {
                if(msg.channel.id !== process.env.DEV_CHANNEL) { return; }
            }

            //If we need to ignore a channel, let's do it
            if(process.env.CHANNEL_IGNORE) {
                if(msg.channel.id == process.env.CHANNEL_IGNORE) { return; }
            }
            
             //localize modules
            var commands    = client.commands;
            var listeners   = client.listeners;

            /*
                Handle Commands
                Mostly just chat commands. Commands are restricted to specific
                triggers and are only called upon if their trigger
                is mentioned
            */
            if(commands) {
                //Loop through all the commands
                var keys = Object.keys(commands);
                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    //console.log(`commands[${key}].getConfig`);
                    if(typeof commands[key].getConfig == 'function') {

                        var cmdsettings = commands[key].getConfig(); //Grabs class specific settings
                        var trigger     = cmdsettings.info.name;
                        var aliases     = cmdsettings.info.aliases;

                        var foundTrigger = false;
                        if(trigger == interaction.commandName) foundTrigger = true;
                        if(aliases != null && aliases.includes(interaction.commandName)) foundTrigger = true;

                        if(foundTrigger) {
                            //See if class has an onChat function to match it's trigger
                            if(typeof commands[key].onInteraction == 'function') {
                                await commands[key].onInteraction(interaction);
                            }
                            return;
                        }

                    }
                }
            }
        });
    }
}