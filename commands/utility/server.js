const { SlashCommandBuilder } = require('discord.js');

const name = 'server';
const shortDescription = 'Provides information about the server.';
const longDescription = shortDescription;

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},
};