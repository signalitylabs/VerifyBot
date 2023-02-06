class command {
    /**
     * Gets the config for the command
     * @returns object 
     */
    getConfig() {
        return this.config;
    }

    setClient(client) {
        this.client = client;
    }

    setModule(module) {
        this.module = module;
    }

    getModule() {
        return this.module;
    }

    privateReply(interaction, message) {
        interaction.reply({ content: message, ephemeral: true });
    }

    /**
     * Triggered when someone uses this command
     * @param {object} msg 
     */
    async onChat(msg) {
        throw new Error(`Command does not have an onChat event`);
    }
}

module.exports = command;