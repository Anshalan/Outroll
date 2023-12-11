const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils');

const name = 'help';
const shortDescription = 'Shows help for the bot. Description, commands and other information.';
const longDescription = `${shortDescription} (YEAH you are seeing just that now)`;

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription),
	async execute(interaction) {
		await utils.replyWithLogInteraction(interaction, prepareHelpMessage());
	},
};

// TODO migrate help messages to script files and extract them here to combine and list as /help content
function prepareHelpMessage() {
	const message = [];
	const description = 'Outroll bot is predestined to help you decide who will be excluded for next activity';
	const commandsDescription = 'Implemented commands:';
	const commands = [];
	const temp = utils.getCommandFilesInUse();
	for (const [command] of temp) {
		const commandDoc = [];
		commandDoc.push(`**/${command.NAME}** `);
		commandDoc.push(`\t-\t${command.LONG_DESCRIPTION}`);
		if (command.PARAMETERS != undefined) {
			commandDoc.push(`\n\t${command.PARAMETERS}`);
		}
		commands.push(commandDoc.join(''));
	}
	const otherInformation = '';
	message.push(description, commandsDescription, commands.join('\n'), otherInformation);
	return message.join('\n');
}