import { activeFights, moves, players, Fight, FightStage } from '../../data/database.js';
import { getFightEmbed, isValidMove } from '../../utils/fightUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const attack = new SlashCommandBuilder()
    .setName('a')
    .setDescription('Attack another player during a fight')
    .addStringOption(option => option.setName('move').setDescription('The move you want to play'));

export function doAttack(interaction : any) {
    if (isValidMove(interaction)) {

    }
}

