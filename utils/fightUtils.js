import { EMBED_COLOUR } from '../../data/storage/config.js';
import { getNameFromId } from './playerUtils.js';
import { players, activeFights } from '../data/database.js';
import { MessageEmbed } from 'discord.js';

// Get fight display
export function getFightEmbed(fight, move) {
    var moveDescription = (move === null) 
        ? `The fight has begun! it is ${getNameFromId(fight.player1)}\'s first move!`
        : move;
    var player1 = getNameFromId(fight.player1);
    var player2 = getNameFromId(fight.player2);

    const fightEmbed = new MessageEmbed()
        .setColor(EMBED_COLOUR)
        .setTitle(`${player1} vs ${player2}`)
        .setDescription(moveDescription)
        .addFields(
            { name: player1, value: `HP: ${fight.p1hp}`, inline: true },
            { name: player2, value: `HP: ${fight.p2hp}`, inline: true }
        );
    
    return fightEmbed;
}

// Check if this move is valid (When an attack command has been passed)
export function isValidMove(interaction) {
    var author = interaction.member.user;

    var fight = undefined;
    activeFights.forEach((v,k) => {
        if (k.includes(author.id) && v.stage == FightStage.Fight) {
            fight = v;
            return;
        }
    });

    // Player isn't in an active fight
    if (fight === undefined) {
        interaction.reply('You\'re not in an active fight!');
        return false;
    }

    // Player is trying to play on opponent turn
    if (fight.turn != author.id) {
        interaction.reply('It\'s not your turn!');
        return false;
    }
    
    // Player is trying to use a move they don't have
    var move = interaction.options.getString('move');
    var playerEntry = players.get(author.id);
    var playerHasMove = false;
    playerEntry.movelist.forEach(playerMove => {
        if (playerMove.split(' ')[1] === move) {
            playerHasMove = true;
            return;
        }
    });
    if (!playerHasMove) {
        interaction.reply('You don\'t have that move!');
        return false;
    }

    return true;
}