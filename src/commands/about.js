const command   = require(`../classes/command.js`);

class about extends command {
    /**
     * Triggered when someone uses this command
     * @param {object} msg 
     */
    async onInteraction(interaction) {
        var client    = this.client;
        var config    = client.getConfig();

        //Basic information about the server we're on
        interaction.reply({ embeds: [{
            color: 0xff8c00,
            author: {
                name: config.Bot[0].name + ' v' + client.info.version,
                icon_url: config.Bot[0].icon,
            },
            description: config.Bot[0].description,
            fields: [{
                name: 'Total Members',
                value: `${interaction.guild.memberCount} `,
                inline: true
            },{
                name: 'Server Founded',
                value: `${interaction.guild.createdAt.toLocaleString()} `,
                inline: true
            },{
                name: 'Bot Birthday',
                value: `${client.user.createdAt.toLocaleString()} `,
                inline: true
            },{
                name: 'Memory Used',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            },{
                name: 'Node.js Version',
                value: process.version,
                inline: true
            },{
                name: 'Discord.js Version',
                value: client.info.dependencies['discord.js'],
                inline: true
            }]
        }]});

        return true;
    }

    /**
     * Command Config
     */
    config = {
        info: {
            name: 'about',
            description: '📰 Useless bot information',
        }
    }
}

module.exports = about;