import { SlashCommandBuilder } from '@discordjs/builders';
import { AdminId, SaveChannel } from '../../config/config.js';
import { bot } from '../../startup.js';
import { TextChannel } from 'discord.js';
import { players } from '../../data/database.js';

export const save = new SlashCommandBuilder()
    .setName('save')
    .setDescription('Save the game (Admin only!)')

export function doSave(interaction : any) {
    if (interaction.member.user.id !== AdminId) {
        interaction.reply('You need to be an admin to do that!');
        return;
    }

    var channel = bot.channels.cache.find(channel => channel.id === SaveChannel);
    if (channel != undefined && channel instanceof TextChannel) {
        var toSend = '';

        players.forEach((v,k) => {
            var output = '';
            output += `${k},${v.xp},${v.wins},${v.losses},`;

            for (let i = 0; i < v.movelist.length; i++) {
                output += (i === v.movelist.length - 1) ?
                    v.movelist[i] + '\n' : v.movelist[i] + ',';
            }

            toSend += output;
        });

        channel.send(toSend);
        interaction.reply('Data has been saved!');
    }
}