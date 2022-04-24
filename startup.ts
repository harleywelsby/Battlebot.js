import { Client, Intents, TextChannel } from 'discord.js';
import { Token, LogChannel, ClientId, GuildId } from './tokens.js';
import { LoadAllData } from './data/dataHandler.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

// Command imports
import { signup, doSignup } from './commands/signup.js';

// Load commands
const commands = [];
commands.push(signup.toJSON());

// Refresh slash commands on startup, refer to below docs
// https://discordjs.guide/interactions/slash-commands.html#guild-commands
const rest = new REST({ version: '9' }).setToken(Token());
(async () => {
    try {
        console.log('Refreshing Slash Commands');
        await rest.put(
            Routes.applicationGuildCommands(ClientId(), GuildId),
            { body: commands }
        );
    }
    catch (error) {
        console.error(error);
    }
})();

//Init the bot
export const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Login
bot.on('ready', () => {
    console.log('logged in!');
    bot.user?.setActivity('everything WORK', { type: 'WATCHING' });
    var channel = bot.channels.cache.find(channel => channel.id === LogChannel);
    if (channel != undefined && channel instanceof TextChannel) {
        channel.send(`Rebooted and logged in`);
    }
    LoadAllData();
});

bot.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'signup') {
        doSignup(interaction);
    }
});

bot.login(Token());