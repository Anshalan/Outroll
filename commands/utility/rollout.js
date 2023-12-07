const { SlashCommandBuilder } = require('discord.js');
const { getVoiceChannelOfTriggeringUser,
	getArrayOfMembersOfChannel,
	sendMessageDirectlyToChannel,
	getTextChannelOfInteraction,
	pickRandomElements,
} = require('../../utils'); //TODO maybe just import whole content of te file
const constants = require('../../constants');

const name = 'rollout';
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
		const voiceChannelContainingAuthor = await getVoiceChannelOfTriggeringUser(interaction);
		const connectedMembersToAuthorVoiceChannel = await getArrayOfMembersOfChannel(voiceChannelContainingAuthor);
		await interaction.reply(`channelContainingAuthor ${voiceChannelContainingAuthor}`);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `connectedMembersToAuthorVoiceChannel ${connectedMembersToAuthorVoiceChannel}`);
		const arrayX = pickRandomElements(constants.DEFAULT_AMOUNT_OF_USERS_TO_BE_SPARED, connectedMembersToAuthorVoiceChannel);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `chosen ${arrayX[1]}`);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `discarded ${arrayX[0]}`);
	},
};