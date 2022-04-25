import { moves, players, Move } from '../../data/database.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { DAMAGE_MODIFIER, LEVEL_CAP, MIN_DAMAGE } from '../../data/storage/config.js';

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

export function doMoves(interaction : any) {
    if (interaction.options.getString('moveset') === 'mine') {
        getMovesMine(interaction);
        return;
    }

    if (interaction.options.getString('moveset') === 'all') {
        getMovesAll(interaction);
        return;
    }
}

// Calculate move accuracy
function getMoveAccuracy(move : Move) : number {
    var miss : number = move.level;
    miss -= LEVEL_CAP - (move.level);
    miss -= move.damage * (-move.level / MIN_DAMAGE);
    return miss;
}

// Calculate move damage with modifiers
function getMoveDamage(move : Move) : number {
    var toHit : number = move.damage + (move.level * DAMAGE_MODIFIER);
    return toHit > MIN_DAMAGE ? toHit : MIN_DAMAGE;
}

function getMoveString(move : Move) : string {
    return `${move.name} \t | ${getMoveDamage(move)}dmg | ${getMoveAccuracy(move)}acc\n`;
}

function getMovesMine(interaction : any) {
    var author = interaction.member.user;
    var playerEntry = players.get(author.id);
    var toSend : string = 'Your moves are:\n';

    for (let i = 0; i < playerEntry.movelist.length; i++) {
        var move : Move = moves.get(playerEntry.movelist[i].split(' ')[1]);
        move.level = playerEntry.movelist[i].split(' ')[0];
        toSend += `L.${playerEntry.movelist[i]} | ${getMoveDamage(move)}dmg | ${getMoveAccuracy(move)}acc\n`;
    }

    interaction.reply(toSend);
}

function getMovesAll(interaction : any) {
    var toSend = 'Here\'s a list of all moves:\n';

    // Sort moves by type
    var valueArray = Array.from(moves.values());
    var punchlist : Move[] = valueArray.filter(move => move.type === 'punch');
    var kicklist : Move[] = valueArray.filter(move => move.type === 'kick');
    var grapplelist : Move[] = valueArray.filter(move => move.type === 'grapple');

    toSend += '\nPunches:\n';
    for (let i = 0; i < punchlist.length; i++) {
        toSend += getMoveString(punchlist[i]);
    }

    toSend += '\nKicks:\n';
    for (let i = 0; i < kicklist.length; i++) {
        toSend += getMoveString(kicklist[i]);
    }

    toSend += '\nGrapples:\n';
    for (let i = 0; i < grapplelist.length; i++) {
        toSend += getMoveString(grapplelist[i]);
    }

    interaction.reply(toSend);
}