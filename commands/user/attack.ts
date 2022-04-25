import { activeFights, moves, players, Fight, FightStage, Move } from '../../data/database.js';
import { getFightEmbed, getPlayerMove, isValidMove } from '../../utils/fightUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from 'discord.js';
import { getMoveDamage } from '../../utils/moveUtils.js';

export const attack = new SlashCommandBuilder()
    .setName('a')
    .setDescription('Attack another player during a fight')
    .addStringOption(option => option.setName('move').setDescription('The move you want to play'));

export function doAttack(interaction : any) {
    // Get values
    var moveString = interaction.options.getString('move').toLowerCase();
    var author : User = interaction.member.user;
    var fight : Fight = undefined;
    activeFights.forEach((v,k) => {
        if (k.includes(author.id) && v.stage == FightStage.Fight) {
            fight = v;
            return;
        }
    });
    
    // Check move is possible
    if (!isValidMove(author, fight, moveString)) {
        return;
    }

    // Get player's leveled move
    var playerMove : string = getPlayerMove(author, moveString);
    var move : Move = moves.get(moveString);
    move.level = parseInt(playerMove.split(' ')[0]);

    // Play the move
    playMove(interaction, author, fight, move);
}

function playMove(interaction : any, author : User, fight : Fight, move : Move) {
    var attacker = players.get(author.id);
    var opponent = fight.player1 === author.id ? players.get(fight.player2) : players.get(fight.player1);
    var toHit = getMoveDamage(move);

    // Calculate type bonuses
    if (fight.lastTurn) {
        var lastType = fight.lastTurn.type.toLowerCase();
        var type = move.type.toLowerCase();

        switch (type) {
            case 'kick':
                break;
            case 'punch':
                break;
            case 'grapple':
                break;
            default:
                interaction.reply('An error has occured, please try again');
                return;
        }
    }
}