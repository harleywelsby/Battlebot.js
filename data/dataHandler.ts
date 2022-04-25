import { moves, Move } from './database.js';
import { getLastAutosave, setLastSave } from './autosave.js';

// JSON import stuff, see here:
// https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//Load data
export function LoadAllData() {
    constructMoveData();
    getLastAutosave();
    setLastSave()
    console.log('Players initialized!');
}

function constructMoveData() {
    var movejson : JSON = require('./storage/moves.json');
    var movedata = movejson["moves"];
    for(let i = 0; i < movedata.length; i++){
        var move : Move = {
            name: movedata[i]["name"],
            type: movedata[i]["type"],
            damage: movedata[i]["damage"],
            level: movedata[i]["level"]
        }
        moves.set(move.name.toLowerCase(), move);
    }
    console.log('Moves initialized!');
}