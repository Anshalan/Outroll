const { SlashCommandBuilder } = require('discord.js');
const { getCommandFiles,
} = require('../../utils');

const name = 'help';
const shortDescription = 'Shows help for the bot. Description, commands and other information.';
const longDescription = `${shortDescription}(YEA you are seeing just that now)`;

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription),
	async execute(interaction) {
		await interaction.reply(prepareHelpMessage());
	},
};

// TODO migrate help messages to script files and extract them here to combine and list as /help content
function prepareHelpMessage() {
	const message = [];
	const description = 'Rollout bot is predestined to help you decide who will be excluded for next activity (game?)';
	const commandsDescription = 'Implemented commands:';
	const commands = [];
	const temp = getCommandFiles();
	for (const [command] of temp) {
		const commandDoc = [];
		commandDoc.push(`**/${command.NAME}**`);
		commandDoc.push(`_${command.LONG_DESCRIPTION}_`);
		commands.push(commandDoc.join('\t-\t'));
	}
	const otherInformation = '';
	message.push(description, commandsDescription, commands.join('\n'), otherInformation);
	return message.join('\n');
}