const command       = require(`../classes/command.js`);
const PayPalAPI     = require('../classes/paypal.js');
const PayPal        = new PayPalAPI();

const VERIFIED  = process.env.ROLE_VERIFIED;

class verify extends command {
    /**
     * Triggered when someone uses this command
     * @param {object} msg 
     */
    async onInteraction(interaction) {
        interaction.deferReply({ ephemeral: true });

        let email = interaction.options.get('email').value;

        if(!String(email).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            interaction.editReply('`' + email + '` is not a valid email address');
            return;
        }
        
        var verifyRole = await PayPal.searchForBuyer(email);
        if( verifyRole == false ) {
            interaction.editReply('Could not find your purchase under `' + email + '`');
            return;
        }
        
        if (interaction.member.roles.cache.some(role => role.id === verifyRole)) {
            interaction.editReply('You are already verified');
            return;
        }

        await interaction.member.roles.add(verifyRole);
        interaction.editReply('Thanks! Your <@&'+verifyRole+'> purchase has been verified under `' + email + '`');
        return;
    }
    
    /**
     * Command Config
     */
    config = {
        info: {
            name: 'verify',
            description: '🔍 Verify your plugin purchase',
            options: [
                {
                    name: 'email',
                    description: 'The PayPal email you used to purchase our plugin',
                    type: 3,
                    required: true
                }
            ]
        }
    }
}

module.exports = verify;