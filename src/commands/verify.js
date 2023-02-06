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

        let email = interaction.options.get('email').value;

        if(!String(email).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            this.privateReply(interaction, '`' + email + '` is not a valid email address');
            return;
        }

        var wasFound = await PayPal.searchForBuyer(email);
        
        if (interaction.member.roles.cache.some(role => role.id === VERIFIED)) {
            this.privateReply(interaction, 'You are already verified');
            return;
        }

        if(wasFound == true) {
            await interaction.member.roles.add(VERIFIED);

            this.privateReply(interaction, 'Thanks! Your purchase has been verified from `' + email + '`. You now have premium support access.');
            return;
        } else {
            this.privateReply(interaction, 'Could not find your purchase under `' + email + '`');
            return;
        }
    }
    
    /**
     * Command Config
     */
    config = {
        info: {
            name: 'verify',
            description: '🔍 Verify your purchase of Epic Core',
            options: [
                {
                    name: 'email',
                    description: 'The PayPal email you used to purchase Epic Core',
                    type: 3,
                    required: true
                }
            ]
        }
    }
}

module.exports = verify;