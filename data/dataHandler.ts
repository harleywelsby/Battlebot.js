import { moves, Move, Rank, ranks, MoveType } from './database.js';
import { getLastAutosave, autosave } from './autosave.js';

// JSON import stuff, see here:
// https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error
import { createRequire } from 'module';
import { loadStatusEffects } from './statusEffectHandler.js';
const require = createRequire(import.meta.url);

//Load data
export function LoadAllData() {
    constructMoveData();
    constructRankData();
    loadStatusEffects();
    getLastAutosave();
    autosave();
    console.log('Players initialized!');
}

function constructMoveData() {
    var movejson : JSON = require('./storage/moves.json');
    var movedata = movejson["moves"];
    for(let i = 0; i < movedata.length; i++) {
        var move : Move = {
            name: movedata[i]["name"].toLowerCase(),
            type: parseMoveType(movedata[i]["type"].toLowerCase()),
            damage: movedata[i]["damage"],
            level: movedata[i]["level"]
        }
        moves.set(move.name.toLowerCase(), move);
    }
    console.log('Moves initialized!');
}

function constructRankData() {
    var rankjson : JSON = require('./storage/ranks.json');
    var rankdata = rankjson["ranks"];
    for (let i = 0; i < rankdata.length; i++) {
        var rank : Rank = {
            name: rankdata[i]["name"].toLowerCase(),
            start: rankdata[i]["start"],
            end: rankdata[i]["end"],
            pic: rankdata[i]["pic"]
        }
        ranks.set(`${rank.start} ${rank.end}`, rank);
    }
}

function parseMoveType(typeString : string) : MoveType {
    switch (typeString) {
        case 'punch':
            return MoveType.Punch;
        case 'kick':
            return MoveType.Kick;
        case 'grapple':
            return MoveType.Grapple;
        case 'ranged':
            return MoveType.Ranged;
        case 'mental':
            return MoveType.Mental;
        case 'slam':
            return MoveType.Slam;
    }
}