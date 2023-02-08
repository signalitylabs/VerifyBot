const { Client, GatewayIntentBits, ActivityType }    = require('discord.js');
const fs                        = require('fs');
const util                      = require('util');
const config                    = require('../config.json');

// Handle Logging //
if (!fs.existsSync(`./logs`)) fs.mkdirSync(`./logs`);
const date      = new Date();
const logDate   = `${date.getFullYear() + 1}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
const logFile   = fs.createWriteStream(`./logs/${logDate}.log`, {flags : 'w'});

console.log = function(d) {
    const now = new Date();
    const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    logFile.write(util.format(`[${formattedDate}] ${d}`) + '\n');
    console.debug(d);
};

/**
 * Core Client
 * @extends {Client}
 */
class Core extends Client { 
	constructor() {
        super({
            partials: ['GUILD_MEMBER',
                        'USER', 
                        'MESSAGE', 
                        'CHANNEL', 
                        'REACTION'],
            intents: [ 
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildInvites
            ],
            presence: {
                status: 'online',
                activities: [{
                    name: '/verify for support',
                    type: ActivityType.Watching
                }],
            },
        });

		/**
		 * Function for pause
		 * @param {number} sec How long to wait (in seconds)
		 * @type {function}
		*/
		this.pause = sec => new Promise(res => setTimeout(res, sec * 1000));

        /**
         * Set globals
         */
        this.info = require('../../package');
    }

    /**
     * Loads listeners into Client
     */
    async loadListeners(listeners) {
        if(listeners) {
            if(!this.listeners) this.listeners = listeners;
        }
    }

    /**
     * Loads commands into Client
     */
    async loadCommands(commands) {
        if(commands) {
            if(!this.commands) this.commands = commands;
        }
    }


    /**
     * Grabs the bot's main config file
     */
    getConfig() {
        return config;
    }
}

module.exports = Core;