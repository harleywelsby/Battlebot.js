import { players, activeFights } from '../../data/database.js';
import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const fight = new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Challenge another player to a fight!')
    .addUserOption(option =>
        option.setName('user')
              .setDescription('Player to challenge')
    );

export function doFight(interaction : any) {
    interaction.reply('Workin on it!');
}