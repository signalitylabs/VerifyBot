const { Client, GatewayIntentBits, ActivityType }    = require('discord.js');
const fs                        = require('fs');
const util                      = require('util');
const config                    = require('../config.json');
const readdir                   = util.promisify(fs.readdir);

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