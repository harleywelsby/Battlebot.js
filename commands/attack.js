import { activeFights, moves, players }from '../data/database.js';
import { BOT_ID, MISS_CHANCE } from '../data/storage/config.js';
import { getFightEmbed } from '../commands/fight.js';
import { eloAdjustment, getNameFromId } from '../data/handlers.js';
import { getMoveAccuracy, getMoveDamage } from '../commands/moves.js';
import { doTurn } from './user/botfight.js';

//Make sure the move that is about to be made can actually be played
function isValidMove(msg) {
    
    //Player exists
    if(players.has(msg.author.id)) {
        for(const [key, value] of activeFights.entries()) {
            
            //Fight lobby exists, and it is in the fight stage
            if(key.includes(msg.author.id) && value.stage.startsWith('FIGHT')) {  

                //It's the player's turn
                if(value.turn.startsWith(msg.author.id)) {
                    
                    //Player has the move they're trying to play
                    var player = players.get(msg.author.id);
                    for(let i=0; i<players.get(msg.author.id).movelist.length; i++) {
                        if(player.movelist[i].toLowerCase().includes(msg.content.split(' ')[1].toLowerCase())) {
                            return true;
                        }
                    }

                    msg.reply('You don\'t have that move!');
                    return false;
                }
                else {
                    msg.reply('It\'s not your turn!');
                    return false;
                }
            }
            //Player isn't in an active fight
            else {
                msg.reply('You\'re not in an active fight!');
                return false;
            }
        }
    }
    else {
        msg.reply('You\'re not in an active fight!')
        return false;
    }
}

//Handle .attack (move) commands and fight logic
export function doMoveLogic(msg) {
    if(isValidMove(msg)) {

        //Get the current fight
        var fight = null;
        for(const [key, value] of activeFights.entries()) {
            if(key.includes(msg.author.id) && value.stage.startsWith('FIGHT')) {  
                fight = activeFights.get(key);
                break;
            }
        }
        if(fight == null) {
            msg.reply('An error has occured - restart the fight lobby and try again.');
            return;
        }

        //Get the players
        if(!players.has(fight.player1) || !players.has(fight.player2)){
            msg.reply('An error has occured - restart the fight lobby and try again.');
            return;
        }

        var attacker = players.get(msg.author.id);
        var opponent = fight.player1 == msg.author.id ? players.get(fight.player2) : players.get(fight.player1);

        //Get the move played and its level
        var move = null;
        for(let i=0; i<players.get(msg.author.id).movelist.length; i++) {
            if(players.get(msg.author.id).movelist[i].toLowerCase().includes(msg.content.split(' ')[1].toLowerCase())) {
                move = moves.get(players.get(msg.author.id).movelist[i].split(' ')[1].toLowerCase());
                move.level = players.get(msg.author.id).movelist[i].split(' ')[0];
            }
        }
        if (move == null) {
            msg.reply('An error has occured - restart the fight lobby and try again.');
        }

        var toHit = getMoveDamage(move);
        //moveTypeBonus(toHit, move.type.toLowerCase(), fight.lastTurn == null ? null : fight.lastTurn.type.toLowerCase());
        var type = move.type.toLowerCase();
        var lastType = fight.lastTurn == null ? null : fight.lastTurn.type.toLowerCase();
        if(lastType != null) {
            if(type.startsWith('kick')) {
                if(lastType.startsWith('punch')) {
                    toHit = toHit * 1.5;
                }
                else if(lastType.startsWith('grapple')) {
                    toHit = toHit * 0.5;
                }
            }
            else if(type.startsWith('punch')) {
                if(lastType.startsWith('grapple')) {
                    toHit = toHit * 1.5;
                }
                else if(lastType.startsWith('kick')) {
                    toHit = toHit * 0.5
                }
            }
            else if(type.startsWith('grapple')) {
                if(lastType.startsWith('kick')) {
                    toHit = toHit * 1.5;
                }
                else if(lastType.startsWith('punch')) {
                    toHit = toHit * 0.5;
                }
            }
        }

        var miss = Math.random()*100;
        miss += getMoveAccuracy(move);

        //TODO:: Status effect processing
        /*if(attacker.effect != null) {
            if(attacker.effect.toLowerCase() == 'concussion')
        }*/

        if(miss > MISS_CHANCE) {
            //If move was played last turn, it does 70% damage
            if(attacker.lastmove != null) {
                if(attacker.lastmove.name.startsWith(move.name)) {
                    toHit = toHit * 0.7;
                }
            }
            attacker.lastMove = move;

            //Calculate "Wide not tall" bonus
            var highest = parseInt(getHighestLevel(attacker));
            if (attacker.movelist.length * 2 > highest) {
                toHit = toHit * 1.2;
            }

            toHit = Math.round(toHit * 100) / 100;

            opponent.name.startsWith(fight.player1) ?
                fight.p1hp -= Math.round(toHit * 100) / 100 :
                fight.p2hp -= Math.round(toHit * 100) / 100;
        }

        //Get embed description
        var moveDescription = null;
        if(miss > MISS_CHANCE) {
            moveDescription = `POW! ${getNameFromId(msg.author.id)} hit ${getNameFromId(opponent.name)} with a ${move.name} (${move.type}) for ${toHit}hp!\n`
        }
        else {
            moveDescription = `WOOSH! ${getNameFromId(msg.author.id)} missed their ${move.name} (${move.type})! No damage has been taken!\n`
        }
        moveDescription += `\nIt is now ${getNameFromId(opponent.name)}\'s turn!\n`;

        //Do embed
        var embed = getFightEmbed(fight, moveDescription);
        msg.channel.send({ embeds: [embed] });

        //Post-turn variable sets
        fight.turn = opponent.name;
        players.get(msg.author.id).lastmove = move;
        activeFights.get(fight.player2 + 'vs' + fight.player1).lastTurn = move;

        //TODO:: Clean this up into a proper method
        if (!fight.player1.includes(BOT_ID())) {
            if(fight.p1hp <= 0) {
                msg.reply(`KO! ${getNameFromId(fight.player2)} destroyed ${getNameFromId(fight.player1)}!`)
                players.get(fight.player1).lastmove = null;
                players.get(fight.player1).effect = null;
                players.get(fight.player2).lastmove = null;
                players.get(fight.player2).effect = null;

                players.get(fight.player1).xp = 
                    parseInt(
                        parseInt(players.get(fight.player1).xp) + 
                        eloAdjustment(false, fight.player2, fight.player1)
                    );
                players.get(fight.player2).xp = 
                    parseInt(
                        parseInt(players.get(fight.player2).xp) + 
                        eloAdjustment(true, fight.player2, fight.player1)
                    );
                
                msg.channel.send(`<@${fight.player2}> gained ${eloAdjustment(true, fight.player2, fight.player1)} rank xp!`);
                msg.channel.send(`<@${fight.player1}> lost ${eloAdjustment(false, fight.player2, fight.player1)} rank xp!`);

                activeFights.delete(fight.player2 + 'vs' + fight.player1);
            }
            else if (fight.p2hp <= 0) {
                msg.reply(`KO! ${getNameFromId(fight.player1)} destroyed ${getNameFromId(fight.player2)}!`)
                players.get(fight.player1).lastmove = null;
                players.get(fight.player1).effect = null;
                players.get(fight.player2).lastmove = null;
                players.get(fight.player2).effect = null;

                players.get(fight.player1).xp = 
                    parseInt(
                        parseInt(players.get(fight.player1).xp) + 
                        eloAdjustment(true, fight.player1, fight.player2)
                    );
                players.get(fight.player2).xp = 
                    parseInt(
                        parseInt(players.get(fight.player2).xp) + 
                        eloAdjustment(false, fight.player1, fight.player2)
                    );
                
                msg.channel.send(`<@${fight.player1}> gained ${eloAdjustment(true, fight.player1, fight.player2)} rank xp!`);
                msg.channel.send(`<@${fight.player2}> lost ${eloAdjustment(false, fight.player1, fight.player2)} rank xp!`);

                activeFights.delete(fight.player2 + 'vs' +fight.player1);
            }
        }
        else {
            //Check if game's done and finish it if so
            if(fight.p1hp <= 0) {
                msg.reply(`KO! ${getNameFromId(fight.player2)} destroyed ${getNameFromId(fight.player1)}!`)
                players.get(fight.player1).lastmove = null;
                players.get(fight.player1).effect = null;
                players.get(fight.player2).lastmove = null;
                players.get(fight.player2).effect = null;

                players.get(fight.player2).xp = 
                    parseInt(
                        parseInt(players.get(fight.player2).xp) + 
                        eloAdjustment(true, fight.player2, fight.player1)
                    );
                msg.channel.send(`<@${fight.player2}> gained ${eloAdjustment(true, fight.player2, fight.player1)} rank xp!`);

                activeFights.delete(fight.player2 + 'vs' + fight.player1);
            }
            else if (fight.p2hp <= 0) {
                msg.reply(`KO! ${getNameFromId(fight.player1)} destroyed ${getNameFromId(fight.player2)}!`)
                players.get(fight.player1).lastmove = null;
                players.get(fight.player1).effect = null;
                players.get(fight.player2).lastmove = null;
                players.get(fight.player2).effect = null;

                players.get(fight.player2).xp = 
                    parseInt(
                        parseInt(players.get(fight.player2).xp) + 
                        eloAdjustment(false, fight.player1, fight.player2)
                    );
                msg.channel.send(`<@${fight.player2}> lost ${eloAdjustment(false, fight.player1, fight.player2)} rank xp!`);

                activeFights.delete(fight.player2 + 'vs' +fight.player1);
            }
            else {
                doTurn(msg, fight);
            }
        }
    }
}

//Get highest level move
function getHighestLevel(player) {
    var highest = player.movelist[0].split(' ')[0];
    for(let i=1; i<player.movelist.length; i++) {
        if(highest < player.movelist[0].split(' ')[0]) {
            highest = player.movelist[0].split(' ')[0];
        }
    }
    return parseInt(highest);
}