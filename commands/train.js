import { moves, activeTraining, players } from '../data/database.js';
import { LEVEL_CAP } from '../config.js';
import { getTimeLeft, getTimeToTrain } from '../handlers.js';

//Handle move training
export function doTrain(msg) {
    //Player isn't signed up
    if(!players.has(msg.author.id)) {
        msg.reply('You haven\'t signed up! Type .signup to start with BattleBot.');
        return;
    }
    //Player is already training
    else if(activeTraining.has(msg.author.id)) {
        msg.reply('You\'re already training ' + activeTraining.get(msg.author.id).name + '! Come back in ' + Math.round((parseInt(getTimeLeft(activeTraining.get(msg.author.id)))/60)) + ' minutes!');
        return;
    }
    //Incorrect arguments
    else if(msg.content.split(' ').length < 2) {
        msg.reply('Incorrect arguments! You need to specify the move you want to train.');
        return;
    }
    //Set up move training
    else {
        //Find the move
        var move = msg.content.split(' ')[1];
        var playermove = null;
        for(let i=0; i<players.get(msg.author.id).movelist.length; i++){
            var tocheck = players.get(msg.author.id).movelist[i].split(' ')[1].toLowerCase();
            if(tocheck.startsWith(move.toLowerCase())) {
                var move = { 
                    name: players.get(msg.author.id).movelist[i].split(' ')[1],
                    level: parseInt(players.get(msg.author.id).movelist[i].split(' ')[0])+1,
                    start: Date.now()
                }
                playermove = move;
                break;
            }
        }
        
        //Train the move
        if(playermove === null) {
            //var lowermove = move.toLowerCase();
            //var formatmove = lowermove.charAt(0).toUpperCase() + lowermove.slice(1);
            if(moves.has(move)) {
                var toTrain = {
                    name: moves.get(move).name,
                    level: 1,
                    start: Date.now()
                }
                msg.reply('Training ' + toTrain.name + ' to level 1... This may take a while... (' + getTimeToTrain(toTrain) + ' mins)');
                activeTraining.set(msg.author.id, toTrain);
                return;
            }
            else {
                msg.reply('That move doesn\'t exist!');
                return;
            }
        }
        else {
            //Player's move is already max level
            if(playermove.level > LEVEL_CAP){
                msg.reply('You\'ve already reached max level for this move!');
                return;
            }
            msg.reply('Training ' + playermove.name + ' to level ' + playermove.level + '... This may take a while... (' + getTimeToTrain(playermove) + ' mins)');
            activeTraining.set(msg.author.id, playermove);
            return;
        }
    }
}