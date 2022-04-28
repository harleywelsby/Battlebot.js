import { activeFights, moves, players, Fight, FightStage, Move, MoveType, Player } from '../../data/database.js';
import { getFightEmbed, getPlayerMove, isValidMove } from '../../utils/fightUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { TextChannel, User } from 'discord.js';
import { getMoveAccuracy, getMoveDamage } from '../../utils/moveUtils.js';
import { MISS_CHANCE } from '../../data/storage/config.js';
import { getNameFromId } from '../../utils/playerUtils.js';
import { bot, DiscordLogChannel } from '../../startup.js';

export const attack = new SlashCommandBuilder()
    .setName('attack')
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
    if (!isValidMove(interaction, author, fight, moveString)) {
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
    var miss = Math.random() * 100;
    miss += getMoveAccuracy(move);

    if (miss > MISS_CHANCE) {
        // Calculate type bonuses
        if (fight.lastTurn) {
            var lastType = fight.lastTurn.type;
            var type = move.type;

            // Calculate move type modifiers
            switch (type) {
                case MoveType.Kick:
                    if (lastType === MoveType.Punch) {
                        toHit *= 1.5;
                    }
                    else if (lastType === MoveType.Grapple) {
                        toHit *= 0.5;
                    }
                    break;
                case MoveType.Punch:
                    if (lastType === MoveType.Grapple) {
                        toHit *= 1.5;
                    }
                    else if (lastType === MoveType.Kick) {
                        toHit *= 0.5;
                    }
                    break;
                case MoveType.Grapple:
                    if (lastType === MoveType.Kick) {
                        toHit *= 1.5;
                    }
                    else if (lastType === MoveType.Punch) {
                        toHit *= 0.5;
                    }
                    break;
                default:
                    interaction.reply('An error has occured, please try again');
                    DiscordLogChannel.send(`Attack failed: Move type could not be found for user ${author.id}`);
                    return;
            }
        }

        // If move was played last turn, damage is reduced
        if (attacker.lastmove && attacker.lastmove.name === move.name) {
            toHit *= 0.7;
        }
        attacker.lastmove = move;

        // Calculate "Wide not tall" bonus
        // This is to discourage leveling up 1 move to max and never expanding
        var highest = getHighestLevel(attacker);
        if (attacker.movelist.length * 2 > highest) {
            toHit *= 1.2;
        }

        // Hit the opponent
        toHit = Math.round(toHit * 100) / 100;
        opponent.name === fight.player1 ? fight.p1hp -= toHit : fight.p2hp -= toHit;
    }

    // Get embed description
    var moveDescription = undefined;
    if (miss > MISS_CHANCE) {
        moveDescription = `POW! ${getNameFromId(author.id)} hit ${getNameFromId(opponent.name)} with a ${move.name} (${move.type}) for ${toHit}hp!\n`
    }
    else {
        moveDescription = `WOOSH! ${getNameFromId(author.id)} missed their ${move.name} (${move.type})! No damage has been taken!\n`
    }
    moveDescription += `\nIt is now ${getNameFromId(opponent.name)}\'s turn!\n`;

    // Execute embed
    var embed = getFightEmbed(fight, moveDescription);
    bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                channel.send({ embeds: [embed] });
            }
            else {
                interaction.reply(`An error has occured, please try again.`);
                DiscordLogChannel.send(`Attack failed: Failed to get embed for user ${author.id}`);
            }
        });
}

//Get highest level move
function getHighestLevel(player : Player) : number {
    var highest : number = parseInt(player.movelist[0].split(' ')[0]);
    for(let i = 1; i < player.movelist.length; i++) {
        var nextMove = parseInt(player.movelist[0].split(' ')[0]);
        if(highest < nextMove ) {
            highest = nextMove;
        }
    }
    return highest;
}