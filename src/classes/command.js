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

    async onChat(msg) {
        throw new Error(`Command does not have an onChat event`);
    }

    async onInteraction(interaction) {
        throw new Error(`Command does not have an onInteraction event`);
    }
}

module.exports = command;