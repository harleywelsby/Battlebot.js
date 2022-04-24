import { moves, players } from './data/database.js';
import { bot } from './startup.js';

//Sort moves by move type
export function sortList(from, to, type) {
    for(const [key, value] of from.entries()) {
        if(value.type === type) {
            to.push(moves.get(key));
        }
    }
}

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

//Get player name from ID
export function getNameFromId(id) {
    return bot.users.cache.find(user => user.id === id).username;
}

export function eloAdjustment(isWinner, winner, loser) {
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
}