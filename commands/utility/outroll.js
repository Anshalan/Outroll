const { SlashCommandBuilder, ChannelType } = require('discord.js');
const utils = require('../../utils');
const constants = require('../../constants');

const name = 'outroll';
const shortDescription = 'Returns list of people excluded from next activity'; // TODO checks if thats matches the implementation
const longDescription = shortDescription;
const parametersDescription = [
	'**_<amount>_**\ttype: _Integer; allowed values >= 1_\t-\tAmount of users to be selected for activity. If not specified default value of 5 will be used.',
	'**_<voicechannel>_**\ttype: _VoiceChannel_ \t-\tVoice channel to be used as a source of users. If not specified default value of current voice channel of caller will be used.',

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
				.setMinValue(1))
		.addChannelOption(option =>
			option.setName('voicechannel')
				.setDescription('voice channel to be used as a source of users')
				.addChannelTypes(ChannelType.GuildVoice)),
	async execute(interaction) {
		const messageToBeReturnedArray = [];
		const channelToBeUsed = interaction.options.getChannel('voicechannel') ?? await utils.getVoiceChannelOfTriggeringUser(interaction);
		const amuntOfUsersToBeSpared = interaction.options.getInteger('amount') ?? constants.DEFAULT_AMOUNT_OF_USERS_TO_BE_SPARED;

		if (channelToBeUsed !== 'NONE') { //TODO I dont like this 'NONE' here, should be changed
			const connectedMembersToVoiceChannel = await utils.getArrayOfMembersOfChannel(channelToBeUsed);
			if (connectedMembersToVoiceChannel.length <= amuntOfUsersToBeSpared) {
				let message = 'Noone has to be excluded, ';
				if (connectedMembersToVoiceChannel.length < amuntOfUsersToBeSpared) {
					message += `you have less then optimal number of users. (${connectedMembersToVoiceChannel.length} < ${amuntOfUsersToBeSpared})`;
				}
				else {
					message += `you have perfect amount of users already. (${amuntOfUsersToBeSpared})`;
				}
				messageToBeReturnedArray.push(message);
			}
			else {
				const arrayX = utils.pickRandomElements(amuntOfUsersToBeSpared, connectedMembersToVoiceChannel);
				messageToBeReturnedArray.push(`Users chosen to stay in group: ${arrayX[0]}\n`
					+ `Users to be discarded: ${arrayX[1]}`);
			}
		}
		else {
			messageToBeReturnedArray.push('No channel has been chosen to be source of users. \n'
				+ 'Please join voiceChannel or pick one with **_voichechannel_** parameter');
		}
		await utils.replyWithLogInteraction(interaction, messageToBeReturnedArray.join('\n'));
	},
};