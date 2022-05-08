import { EmbedColour } from '../config/config.js';
import { getNameFromId } from './playerUtils.js';
import { players } from '../data/database.js';
import { MessageEmbed } from 'discord.js';

// Get fight display
export function getFightEmbed(fight, move) {
    var moveDescription = (move === null) 
        ? `The fight has begun! it is ${getNameFromId(fight.player1)}\'s first move!`
        : move;
    var player1 = getNameFromId(fight.player1);
    var player2 = getNameFromId(fight.player2);

    const fightEmbed = new MessageEmbed()
        .setColor(EmbedColour)
        .setTitle(`${player1} vs ${player2}`)
        .setDescription(moveDescription)
        .addFields(
            { name: player1, value: `HP: ${fight.p1hp}`, inline: true },
            { name: player2, value: `HP: ${fight.p2hp}`, inline: true }
        );
    
    return fightEmbed;
}

// Check if this move is valid (When an attack command has been passed)
export function isValidMove(interaction, author, fight, move) {

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
    if (!getPlayerMove(author, move)) {
        interaction.reply('You don\'t have that move!');
        return false;
    }

    return true;
}
// Check if player has given move
export function getPlayerMove(author, move) {
    var playerEntry = players.get(author.id);
    var playerHasMove = undefined;
    playerEntry.movelist.forEach(playerMove => {
        if (playerMove.split(' ')[1].toLowerCase() === move) {
            playerHasMove = playerMove;
            return;
        }
    });

    return playerHasMove;
}

// Return player elo adjustments after a round
export function eloAdjustment(winner, loser) {
    winner = players.get(winner);
    loser = players.get(loser);

    var winnerAdjustment = 30;
    winnerAdjustment = (winner.xp > loser.xp) ? parseInt(winnerAdjustment - ((winner.xp - loser.xp) / 100)) : parseInt(winnerAdjustment + ((loser.xp - winner.xp) / 100));
    winnerAdjustment = (winnerAdjustment < 10) ? 10 : winnerAdjustment;
    
    var loserAdjustment = -15;
    loserAdjustment = (loser.xp > winner.xp) ? parseInt(loserAdjustment - ((loser.xp - winner.xp) / 100)) : parseInt(loserAdjustment + ((winner.xp - loser.xp) / 100));
    loserAdjustment = (loserAdjustment > 0) ? 0 : loserAdjustment;

    return [winnerAdjustment, loserAdjustment];
}