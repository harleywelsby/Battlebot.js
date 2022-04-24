import { moves, Move } from './database.js';
import { getLastAutosave, setLastSave } from './autosave.js';
import { readFile } from 'fs/promises';

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
    var movedata = require('./storage/moves.json');
    console.log(movedata);
    /*for(let i = 0; i < data.length; i++){
        var move : Move = {
            name: data[i][0],
            type: data[i][1],
            damage: parseInt(data[i][2]),
            level: parseInt(data[i][3])
        }
        moves.set(move.name.toLowerCase(), move);
        console.log(move);
    }*/
    console.log('Moves initialized!');
}