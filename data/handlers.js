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