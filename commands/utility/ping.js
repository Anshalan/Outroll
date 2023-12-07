const { SlashCommandBuilder } = require('discord.js');

const name = 'ping';
const shortDescription = 'Replies with Pong';
const longDescription = shortDescription;

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};