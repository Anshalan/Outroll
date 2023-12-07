const fs = require('node:fs');
const path = require('node:path');

async function getVoiceChannelOfTriggeringUser(interaction) {

	// TODO siplify when confirmed it works correctly

	const guild = interaction.guild;
	const user = interaction.user;

	// await guild.members.fetch();

	// GuildChannelManager
	const channels = guild.channels;
	// Collection <Snowflake, (GuildChannel|ThreadChannel)>
	const cacheMap = channels.cache;
	const channelList = Array.from(cacheMap.values()).filter(channel => channel.isVoiceBased() === true);
	const channelContainingAuthor = channelList.filter(
		channel => Array.from(channel.members.values()) // GuildMember collcetion
			.some(member => member.user.id === user.id));
	return channelContainingAuthor.length === 0 ? 'NONE' : channelContainingAuthor.at(0);
}

// gets members from channel; ignors bots
async function getArrayOfMembersOfChannel(channel) {
	return Array.from(channel.members.values()).filter(member => member.user.bot === false);
}
function sendMessageDirectlyToChannel(textChannel, message) {
	textChannel.send(message);
}
function getTextChannelOfInteraction(interaction) {
	return interaction.channel;
}
function getCommandFiles() {
	const commandFilesMap = new Map(); //command is a key, path is a value
	const foldersPath = path.join(__dirname, 'commands');
	const commandsFolders = fs.readdirSync(foldersPath);

	for (const folder of commandsFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			commandFilesMap.set(command, filePath);
		}
	}
	return commandFilesMap;
}
function pickRandomElements(amountsOfElementsToStay, elements) {
	if (elements.length <= amountsOfElementsToStay) {
		return null;
	}
	const arrayToBeRerurned = elements;
	const removedEmelents = [];
	console.log(arrayToBeRerurned);
	for (let i = 0; i < (elements.length - amountsOfElementsToStay); i++) {
		removedEmelents.push(arrayToBeRerurned.splice(Math.floor(Math.random() * arrayToBeRerurned.length), 1));
	}
	return [arrayToBeRerurned, removedEmelents];

}

module.exports = {
	getVoiceChannelOfTriggeringUser,
	getArrayOfMembersOfChannel,
	sendMessageDirectlyToChannel,
	getTextChannelOfInteraction,
	pickRandomElements,
	getCommandFiles,
};