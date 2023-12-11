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
function getCommandFilesInUse() {
	const commandFilesMap = new Map(); //command is a key, path is a value
	const foldersPath = path.join(__dirname, 'commands');
	const commandsFolders = fs.readdirSync(foldersPath);

	for (const folder of commandsFolders) {
		if (folder === 'unused') {
			continue;
		}
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
	const arrayToBeRerurned = elements.slice();
	const removedEmelents = [];
	console.log(arrayToBeRerurned);
	for (let i = 0; i < (elements.length - amountsOfElementsToStay); i++) {
		removedEmelents.push(arrayToBeRerurned.splice(Math.floor(Math.random() * arrayToBeRerurned.length), 1));
	}
	return [arrayToBeRerurned, removedEmelents];

}
function logIncomingInteraction(interaction) {
	const logMessage = [];
  logMessage.push(`Interaction : ${interaction.token}`);
	logMessage.push(`User: ${getCallingUserFromInteraction(interaction)} on server: ${getCallingServerFromInteraction(interaction)} used command: ${getCommandFromInteraction(interaction)}`); //TODO with parameters
	const commandOptions = interaction.options._hoistedOptions;
	if (commandOptions.length > 0) {
		logMessage.push('Command options:');
		const commandOptionsToBeLogged = [];
		commandOptions.forEach(option => {
			commandOptionsToBeLogged.push(`\t${option.name}: ${option.value}`);
		});
		logMessage.push(commandOptionsToBeLogged.join('\n'));
	}
	log(logMessage.join('\n'));
}

function getCallingUserFromInteraction(interaction) {
	return interaction.user.username;
}
function getCallingServerFromInteraction(interaction) {
	return interaction.guild.name;
}
function getCommandFromInteraction(interaction) {
	return interaction.commandName;
}
function log(logMessage) {
	console.log(`${getCurrentTimestamp()} - ${logMessage}`);
}
function getCurrentTimestamp() {
	return new Date().toLocaleString().replace(/T.*Z/, '');
}

async function replyWithLogInteraction(interaction, response) {
	const logMessage =
		`Interaction response ${interaction.token} \n` +
		`Responding for the ${getCommandFromInteraction(interaction)} by ${getCallingUserFromInteraction(interaction)} on ${getCallingServerFromInteraction(interaction)}:\n` + response;
	log(logMessage);
	await interaction.reply(response);
}

module.exports = {
	getVoiceChannelOfTriggeringUser,
	getArrayOfMembersOfChannel,
	sendMessageDirectlyToChannel,
	getTextChannelOfInteraction,
	pickRandomElements,
	getCommandFilesInUse,
	logIncomingInteraction,
	getCallingUserFromInteraction,
	getCallingServerFromInteraction,
	getCommandFromInteraction,
	log,
	getCurrentTimestamp,
	replyWithLogInteraction,
};