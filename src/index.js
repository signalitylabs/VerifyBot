/*
    :::::::::      :::   :::   ::: :::        :::::::::: :::::::::: 
    :+:    :+:   :+: :+: :+:   :+: :+:        :+:        :+:        
    +:+    +:+  +:+   +:+ +:+ +:+  +:+        +:+        +:+        
    +#++:++#+  +#++:++#++: +#++:   +#+        +#++:++#   +#++:++#   
    +#+    +#+ +#+     +#+  +#+    +#+        +#+        +#+        
    #+#    #+# #+#     #+#  #+#    #+#        #+#        #+#        
    #########  ###     ###  ###    ########## ########## ########## 


    Copyright notice:
    Unless otherwise noted, this private source code is the copyright
    and intellectual property of Adam "Centers" Parker. Unauthroized
    distribution or use of this code is strictly prohibited. 
*/


const { REST, Routes }          = require('discord.js');
const bot                       = require('./base/core.js');
const eventLoader               = require('./base/loaders/events');
const commandLoader             = require('./base/loaders/commands');
const errorHandler              = require('./base/handlers/error');
const client                    = new bot();


const { Client,  }  = require('discord.js');
const BOT_TOKEN     = process.env.BOT_TOKEN;
const rest          = new REST({ version: '10' }).setToken(BOT_TOKEN);


(async () => {
    try {
        console.log(`✅ Verification Bot v${client.info.version}`);

        await eventLoader.getEvents(client);
        commands = await commandLoader.getCommands(client);

        var botCommands = new Array();
        for (const command of Object.keys(commands)) {
            const cmd = commands[command];
            var config = cmd.getConfig();

            if(!config.info.name) continue; 

            botCommands.push(config.info);
        }

        const BOT_CLIENT = process.env.BOT_CLIENT;
        await rest.put(Routes.applicationCommands(BOT_CLIENT), { body: botCommands });

        client.login(BOT_TOKEN);
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    process.on('disconnect', () => errorHandler.disconnect())
    .on('reconnecting', () => errorHandler.reconnecting())
    .on('warn', err => errorHandler.warn(err))
    .on('error', err => errorHandler.error(err))
    .on('DiscordAPIError', err => errorHandler.DiscordAPIError(err))
    .on('uncaughtException', err => errorHandler.unhandledRejection(err))
    .on('unhandledRejection', err => errorHandler.unhandledRejection(err));
});


