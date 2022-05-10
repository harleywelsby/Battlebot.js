import { SlashCommandBuilder } from '@discordjs/builders';
import { LevelCap } from '../../config/config.js';
import { moves, Move } from '../../data/database.js';
import { StatusEffect } from '../../data/statusEffectHandler.js';
import { getMoveAccuracy, getMoveDamage, getStrongAgainst, getWeakAgainst, moveEnumToString } from '../../utils/moveUtils.js';
import { checkForEffect } from '../../utils/statusEffectUtils.js';

export const analyze = new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Analyze a move and see its effects and weaknesses')
    .addStringOption(option => option.setName('move').setDescription('The move you want to analyze'));

export function doAnalyze(interaction : any) {
    // Get the move
    var moveString = interaction.options.getString('move')?.toLowerCase();
    if (!moveString) {
        interaction.reply('Please specify a move first!');
        return;
    }

    var move : Move = moves.get(moveString.toLowerCase());
    var maxLevelMove : Move = {
        name: move.name,
        level: LevelCap,
        type: move.type,
        damage: move.damage
    }

    // Get any effects TODO: Currently not working
    var effect : StatusEffect = checkForEffect(move, true);

    var output = `${move.name} analysis:\n`;
    output += `Min Damage: ${Math.round(getMoveDamage(move))}, Max Damage: ${Math.round(getMoveDamage(maxLevelMove))}\n`;
    output += `Min Accuracy: ${Math.round(getMoveAccuracy(move))}, Max Accuracy: ${Math.round(getMoveAccuracy(maxLevelMove))}\n`;
    
    if (effect) {
        output += `Causes the ${effect} status effect\n`;
    }

    var strongAgainst = getStrongAgainst(move.type);
    output += `\nStrong against: `;
    output += moveEnumToString(strongAgainst[0]);
    for (let i = 1; i < strongAgainst.length; i++) {
        output += `, ${moveEnumToString(strongAgainst[i])}`
    }

    var weakAgainst = getWeakAgainst(move.type);
    output += `\nWeak against: `
    output += moveEnumToString(weakAgainst[0]);
    for (let i = 1; i < weakAgainst.length; i++) {
        output += `, ${moveEnumToString(weakAgainst[i])}`;
    }

    interaction.reply(output);
}