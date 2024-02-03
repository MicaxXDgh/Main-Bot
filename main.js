const { Client, Collection, Events, IntentsBitField } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
require('dotenv').config();

let config;
try {
  const rawConfig = fs.readFileSync('config.json');
  config = JSON.parse(rawConfig);
} catch (error) {
  console.error('Error reading or parsing the configuration file:', error.message);
  process.exit(1);
}
const prefix = config.prefix;

const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });
client.commands = new Collection();

//** Command Handler */

const foldersPath = path.join(__dirname, './src/Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`[INFO] Command "${command.data.name}" loaded from ${filePath}`);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
};


//** Event Handler */
const eventsPath = path.join(__dirname, './src/Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//** Interaction Handler */

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

client.login(process.env.TOKEN);