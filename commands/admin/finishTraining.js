// Work in progress as a slash command TODO

import { activeTraining, players }from '../../data/database.js';

//Force-finish all current training
export function doFinTrain(msg) {
    var toRemoveKeys = [];
    for(const [key, value] of activeTraining.entries()) {
        msg.channel.send('<@' + key + '> your ' + value.name + ' has reached level ' + value.level + '!');
        
        //Update move in player's movelist
        var found = false;
        for(let i=0; i<players.get(key).movelist.length; i++) {
            var tocheck = players.get(key).movelist[i].split(' ')[1].toLowerCase();
            if(tocheck.startsWith(value.name.toLowerCase())) {
                found = true;
                players.get(key).movelist[i] = value.level + ' ' + value.name;
                break;
            }
        }

        //Add new move to player
        if(found === false) {
            players.get(key).movelist.push('1 ' + value.name);
        }
        
        toRemoveKeys.push(key);
    }

    //Remove the moves that have finished training
    for(let i=0; i<toRemoveKeys.length; i++) {
        activeTraining.delete(toRemoveKeys[i]);
    }
}