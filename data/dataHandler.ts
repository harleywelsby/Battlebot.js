import Papa from 'papaparse';
import * as fs from 'fs';
import { moves } from './database.js';
import { getLastAutosave, setLastSave } from './autosave.js';

var movefile = './data/moves.csv';

//Load data
export function doFiles() {
    Papa.parse(fs.createReadStream(movefile), {
        delimiter: ",",
        header: false,
        complete: function(results) {
            for(let i=0; i<results.data.length; i++){
                var move = {
                    name: results.data[i][0],
                    type: results.data[i][1],
                    hp: results.data[i][2],
                    level: results.data[i][3]
                }
                moves.set(move.name.toLowerCase(), move);
            }
            console.log('Moves initialized!');
        }
    });

    getLastAutosave();
    setLastSave()
    console.log('Players initialized!');
}