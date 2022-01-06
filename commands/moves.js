import { players, moves } from '../battlebot.js';
import { sortList } from '../handlers.js';

//Calculate accuracy of a given move
export function getMoveAccuracy(move) {
    var miss = move.level;
    miss -= (30-(move.level));
    miss -= move.hp*(-move.level/5);
    return miss;
}

export function getMoveDamage(move) {
    var toHit = parseInt(move.hp) + parseInt(move.level * 0.7);
    if (toHit < 5) {
        toHit = 5;
    }
    return toHit;
}

//Return a player's moves
export function getMoves(msg) {
    var splitargs = msg.content.split(' ');
    
    if(splitargs.length == 1){
        msg.reply('Incorrect arguments! Use \'.moves mine\' or \'.moves all\'!');
        return;
    }
    else {
        if(splitargs[1].toLowerCase() === 'mine'){
            if(!players.has(msg.author.id)){
                msg.reply('You don\'t exist!');
            }
            else {
                var toSend = 'Your moves are:\n';
                for(let i=0; i<players.get(msg.author.id).movelist.length; i++){
                    var move = moves.get(players.get(msg.author.id).movelist[i].split(' ')[1].toLowerCase());
                    move.level = players.get(msg.author.id).movelist[i].split(' ')[0];
                    toSend += 'L.' + players.get(msg.author.id).movelist[i] + ` (${getMoveDamage(move)}dmg, ${getMoveAccuracy(move)}acc)\n`;
                }
                msg.reply(toSend);
            }
        }
        else if(splitargs[1].toLowerCase() === 'all'){
            var toSend = 'Here\'s a list of all moves:\n\n';
            
            //Sort the moves by type
            var punchlist = [];
            var kicklist = [];
            var grapplelist = [];
            sortList(moves, punchlist, 'Punch');
            sortList(moves, kicklist, 'Kick');
            sortList(moves, grapplelist, 'Grapple');

            toSend += 'Punches:\n';
            for(let i=0; i<punchlist.length; i++){
                toSend += getMoveDamage(punchlist[i]) + 'dmg, ' + getMoveAccuracy(punchlist[i]) + 'acc\t ' + punchlist[i].name + '\n';
            }
            toSend += '\nKicks:\n';
            for(let i=0; i<kicklist.length; i++){
                toSend += getMoveDamage(kicklist[i]) + 'dmg, ' + getMoveAccuracy(kicklist[i]) + 'acc\t ' + kicklist[i].name + '\n';
            }
            toSend += '\nGrapples:\n';
            for(let i=0; i<grapplelist.length; i++){
                toSend += getMoveDamage(grapplelist[i]) + 'dmg, ' + getMoveAccuracy(grapplelist[i]) + 'acc\t ' + grapplelist[i].name + '\n';
            }
            msg.reply(toSend);
        }
    }
}