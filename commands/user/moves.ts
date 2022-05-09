import { moves, players, Move, MoveType } from '../../data/database.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getMoveAccuracy, getMoveDamage, getMoveString, moveEnumToString } from '../../utils/moveUtils.js';
import { DiscordLogChannel } from '../../startup.js';

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

function getMovesMine(interaction : any) {
    var author = interaction.member.user;
    var playerEntry = players.get(author.id);
    var toSend : string = 'Your moves are:\n';

    for (let i = 0; i < playerEntry.movelist.length; i++) {
        var movelistMove : Move = moves.get(playerEntry.movelist[i].split(' ')[1].toLowerCase());
        var move : Move = {
            name: movelistMove.name,
            level: movelistMove.level,
            type: movelistMove.type,
            damage: movelistMove.damage
        }
        if (move === null) {
            DiscordLogChannel.send(`Moves for player ${author.id} displayed incorrrectly at ${i}: Invalid move`);
        }
        move.level = parseInt(playerEntry.movelist[i].split(' ')[0]);
        toSend += `L.${playerEntry.movelist[i]} | ${moveEnumToString(move.type)} | ${Math.round(getMoveDamage(move))}dmg | ${Math.round(getMoveAccuracy(move))}acc\n`;
    }

    interaction.reply({
        content: toSend,
        ephemeral: true
    });
}

function getMovesAll(interaction : any) {
    var toSend = 'Here\'s a list of all moves:\n';

    // Sort moves by type
    var valueArray = Array.from(moves.values());
    var punchlist : Move[] = valueArray.filter(move => move.type === MoveType.Punch);
    var kicklist : Move[] = valueArray.filter(move => move.type === MoveType.Kick);
    var grapplelist : Move[] = valueArray.filter(move => move.type === MoveType.Grapple);
    var rangedlist : Move[] = valueArray.filter(move => move.type === MoveType.Ranged);
    var mentallist : Move[] = valueArray.filter(move => move.type === MoveType.Mental);
    var bodyslamlist : Move[] = valueArray.filter(move => move.type === MoveType.Slam);

    toSend += '\nPunch:\n';
    for (let i = 0; i < punchlist.length; i++) {
        toSend += getMoveString(punchlist[i]);
    }

    toSend += '\nKick:\n';
    for (let i = 0; i < kicklist.length; i++) {
        toSend += getMoveString(kicklist[i]);
    }

    toSend += '\nGrapple:\n';
    for (let i = 0; i < grapplelist.length; i++) {
        toSend += getMoveString(grapplelist[i]);
    }

    toSend += '\nRanged:\n';
    for (let i = 0; i < rangedlist.length; i++) {
        toSend += getMoveString(rangedlist[i]);
    }

    toSend += '\nMental:\n';
    for (let i = 0; i < mentallist.length; i++) {
        toSend += getMoveString(mentallist[i]);
    }

    toSend += '\nSlam:\n';
    for (let i = 0; i < bodyslamlist.length; i++) {
        toSend += getMoveString(bodyslamlist[i]);
    }

    interaction.reply({
        content: toSend,
        ephemeral: true
    });
}