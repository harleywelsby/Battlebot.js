import { Client, Intents, TextChannel } from 'discord.js';
import { Token, LogChannel } from './tokens.js';

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
    //doFiles();
});

bot.login(Token());