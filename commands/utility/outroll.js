const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils');
const constants = require('../../constants');

const name = 'outroll';
const shortDescription = 'Returns list of people excluded from next game'; // TODO checks if thats matches the implementation
const longDescription = shortDescription;
const parametersDescription = [
	'**_<amount>_**\t_type: Integer; allowed values >= 1_\t-\tAmount of users to be selected for activity',
];

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,
	PARAMETERS: parametersDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount of users to be selected for activity')
				.setMinValue(1)),
	async execute(interaction) {
		const messageToBeReturnedArray = [];
		const voiceChannelContainingAuthor = await utils.getVoiceChannelOfTriggeringUser(interaction);
		if (voiceChannelContainingAuthor !== 'NONE') {
			const connectedMembersToAuthorVoiceChannel = await utils.getArrayOfMembersOfChannel(voiceChannelContainingAuthor);
			const amuntOfUsersToBeSpared = interaction.options.getInteger('amount') ?? constants.DEFAULT_AMOUNT_OF_USERS_TO_BE_SPARED;
			if (connectedMembersToAuthorVoiceChannel.length <= amuntOfUsersToBeSpared) {
				let message = 'Noone has to be excluded, ';
				if (connectedMembersToAuthorVoiceChannel.length < amuntOfUsersToBeSpared) {
					message += 'you have less then optimal number of users.';
				}
				else {
					message += 'you have perfect amount of users already.';
				}
				messageToBeReturnedArray.push(message);
			}
			else {
				const arrayX = utils.pickRandomElements(amuntOfUsersToBeSpared, connectedMembersToAuthorVoiceChannel);
				messageToBeReturnedArray.push(`Users chosen to stay in group: ${arrayX[0]}\n`
					+ `Users to be discarded: ${arrayX[1]}`);
			}
		}
		else {
			messageToBeReturnedArray.push('You are not at a voice channel.\n' + 'Currently this command is operating on users in channel you are connected to');
		}
		await utils.replyWithLogInteraction(interaction, messageToBeReturnedArray.join('\n'));
	},
};