import { moves, players, Move } from '../../data/database.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const checkMoves = new SlashCommandBuilder()
    .setName('moves')
    .setDescription('See your own moves, or a list of all moves available!')
    .addStringOption(option =>
        option.setName('moveset')
              .setDescription('Which moveset to view')
              .setRequired(true)
              .addChoice('Mine', 'mine')
              .addChoice('All', 'all')
    );

// Calculate move accuracy
function getMoveAccuracy(move : Move) : number {
    var miss : number = move.level;
    miss -= 30 - (move.level);
    miss -= move.damage * (-move.level / 5);
    return miss;
}

// Calculate move damage with modifiers
function getMoveDamage(move : Move) : number {
    var toHit : number = move.damage + (move.level * 0.7);
    return toHit > 5 ? toHit : 5; // TODO: Config values for max level, min dmg
}

export function doMoves(interaction : any) {
    var author = interaction.member.user;

    if (interaction.options.getString('moveset') === 'mine') {
        
    }
    else if (interaction.options.getString('moveset') === 'all') {

    }
}