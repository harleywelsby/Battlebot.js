// Currently deprecated - Will be reimplemented after base features reworked TODO

import { activeFights, moves, players }from '../../data/database.js';
import { BOT_ID, MISS_CHANCE } from "../../config.js";
import { getFightEmbed, initFightArena } from "./fight.js";
import { getMoveAccuracy, getMoveDamage } from "./moves.js";
import { getNameFromId, eloAdjustment } from "../../handlers.js";

export function botfight(msg) {
    msg.reply('You\'ve challenged the master, aye? Prepare for a beatdown!');
    var fight = {
        player1: BOT_ID(),
        player2: msg.author.id,
        p1hp: 100,
        p2hp: 100,
        turn: msg.mentions.users.first().id,
        stage: 'FIGHT',
        lastTurn: null
    }
    activeFights.set(msg.author.id + 'vs' + BOT_ID(), fight);

    initFightArena(msg, fight);
    doTurn(msg, activeFights.get(msg.author.id + 'vs' + BOT_ID()));
}

export function doTurn(msg, fight) {
    var opponent = players.get(fight.player2);
    var attacker = players.get(fight.player1);
    
    var randomRoll = (parseInt(Math.random() * attacker.movelist.length)-1);
    randomRoll < 0 ? randomRoll = 0 : randomRoll = randomRoll;
    var movedata = attacker.movelist[randomRoll];

    var move = {
        name: movedata.split(' ')[1],
        level: movedata.split(' ')[0],
        hp: moves.get(movedata.split(' ')[1].toLowerCase()).hp,
        type: moves.get(movedata.split(' ')[1].toLowerCase()).type
    }

    var toHit = getMoveDamage(move);
    var type = move.type;
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

    //TODO:: Status effects here

    //Move hits
    if (miss > MISS_CHANCE) {
        if (attacker.lastmove != null) {
            if(attacker.lastmove.name.startsWith(move.name)) {
                toHit = toHit * 0.7;
            }
        }
        attacker.lastMove = move;

        toHit = Math.round(toHit * 100) / 100;
        fight.p2hp -= toHit;
    }

    //Get embed desc
    var moveDescription = null;
    if(miss > MISS_CHANCE) {
        moveDescription = `POW! ${getNameFromId(BOT_ID())} hit ${getNameFromId(fight.player2)} with a ${move.name} (${move.type}) for ${toHit}hp!\n`
    }
    else {
        moveDescription = `WOOSH! ${getNameFromId(BOT_ID())} missed their ${move.name} (${move.type})! No damage has been taken!\n`
    }
    moveDescription += `\nIt is now ${getNameFromId(fight.player2)}\'s turn!\n`;

    //Do embed
    var embed = getFightEmbed(fight, moveDescription);
    msg.channel.send({ embeds: [embed] });

    //Post-turn operations
    fight.turn = opponent.name;
    players.get(BOT_ID()).lastmove = move;
    activeFights.get(fight.player2 + 'vs' + fight.player1).lastTurn = move;

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
}