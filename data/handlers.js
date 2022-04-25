//import { players } from './database.js';
//import { bot } from '../startup.js';

//Get a random number for move draw
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Calculate time training should take
export function getTimeToTrain(move) {
    return (parseInt(move.level)/5)*15;
}

//Calculate how much time is left on active training in seconds
export function getTimeLeft(move) {
    var trainTime = parseInt(getTimeToTrain(move))*60;
    var now = Date.now();
    var sofar = (parseInt(now) - parseInt(move.start))/1000;
    return trainTime - sofar;
}

// TODO: Should be moved to fightUtils
/*export function eloAdjustment(isWinner, winner, loser) {
    winner = players.get(winner);
    loser = players.get(loser);

    //If winner should have elo changed
    if (isWinner) {
        var adjustment = 30;
        if (winner.xp > loser.xp) {
            adjustment = parseInt(adjustment - ((winner.xp-loser.xp)/100));
        }
        else {
            adjustment = parseInt(adjustment + ((loser.xp-winner.xp)/100));
        }
        if (adjustment < 10) {
            adjustment = 10;
        }
        return adjustment;
    }
    //Otherwise change loser's elo
    else {
        var adjustment = -15;
        if (loser.xp > winner.xp) {
            adjustment = parseInt(adjustment - ((loser.xp-winner.xp)/100));
        }
        else {
            adjustment = parseInt(adjustment + ((winner.xp-loser.xp)/100));
        }
        if (adjustment > 0) {
            adjustment = 0;
        }
        return adjustment;
    }
}*/