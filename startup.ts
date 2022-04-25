import { Client, Intents, TextChannel } from 'discord.js';
import { Token, LogChannel, ClientId, GuildId } from './data/storage/tokens.js';
import { LoadAllData } from './data/dataHandler.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { players } from './data/database.js';

// Command imports
import { signup, doSignup } from './commands/user/signup.js';
import { checkMoves, doMoves } from './commands/user/moves.js';
import { train, doTrain } from './commands/user/train.js';
import { fight, doFight } from './commands/user/fight.js';
import { profile, doProfile } from './commands/user/profile.js';

// Load commands
const commands = [];
commands.push(signup.toJSON());
commands.push(checkMoves.toJSON());
commands.push(train.toJSON());
commands.push(fight.toJSON());
commands.push(profile.toJSON());

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

    // Check that the user has signed up
    if (!players.has(interaction.member.user.id)
        && interaction.commandName != 'signup') {
        interaction.reply('You need to sign up first! Use /signup!');
        return;
    }

    switch (interaction.commandName) {
        case 'signup':
            doSignup(interaction);
            break;
        case 'moves':
            doMoves(interaction);
            break;
        case 'train':
            doTrain(interaction);
            break;
        case 'fight':
            doFight(interaction);
            break;
        case 'profile':
            doProfile(interaction);
            break;
        default:
            interaction.reply('An error has occured, please try again.');
    }
});

bot.login(Token());