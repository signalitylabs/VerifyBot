const { TextChannel } = require('discord.js');

const textSend = TextChannel.prototype.send;
TextChannel.prototype.send = function(...args) {
	const send = textSend.bind(this);
	if (!this.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;

	try {
		return send(...args);
	} catch (err) {
		console.log(err.message);
	}
};