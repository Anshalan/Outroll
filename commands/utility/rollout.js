const { SlashCommandBuilder } = require('discord.js');
const { getVoiceChannelOfTriggeringUser,
	getArrayOfMembersOfChannel,
	sendMessageDirectlyToChannel,
	getTextChannelOfInteraction,
	pickRandomElements,
} = require('../../utils');

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
		// await interaction.reply(`connectedMembersToAuthorVoiceChannel ${connectedMembersToAuthorVoiceChannel}`);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `connectedMembersToAuthorVoiceChannel ${connectedMembersToAuthorVoiceChannel}`);

		const arrayX = pickRandomElements(1/* default value, change to 5 in beta*/, connectedMembersToAuthorVoiceChannel);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `chosen ${arrayX[1]}`);
		sendMessageDirectlyToChannel(getTextChannelOfInteraction(interaction), `discarded ${arrayX[0]}`);
	},
};