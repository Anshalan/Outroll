const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils');
const constants = require('../../constants');

const name = 'outroll';
const shortDescription = 'Returns list of people excluded from next game'; // TODO checks if thats matches the implementation
const longDescription = shortDescription;

module.exports = {
	NAME: name,
	SHORT_DESCRIPTION: shortDescription,
	LONG_DESCRIPTION: longDescription,

	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(shortDescription),
	async execute(interaction) {
		const messageToBeReturnedArray = [];
		const voiceChannelContainingAuthor = await utils.getVoiceChannelOfTriggeringUser(interaction);
		if (voiceChannelContainingAuthor !== 'NONE') {
			const connectedMembersToAuthorVoiceChannel = await utils.getArrayOfMembersOfChannel(voiceChannelContainingAuthor);
			const amuntOfUsersToBeSpared = constants.DEFAULT_AMOUNT_OF_USERS_TO_BE_SPARED;
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
				messageToBeReturnedArray.push(`Users chosen to stay in group: ${arrayX[1]}\n`
					+ `Users to be discarded: ${arrayX[0]}`);
			}
		}
		else {
			messageToBeReturnedArray.push('You are not at a voice channel.\n' + 'Currently this command is operating on users in channel you are connected to');
		}
		await interaction.reply(messageToBeReturnedArray.join('\n'));
	},
};