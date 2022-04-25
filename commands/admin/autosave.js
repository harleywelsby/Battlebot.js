// Work in progress as a slash command TODO

import { bot } from '../../startup.js';
import { players }from '../../data/database.js';
import { SAVE_CHANNEL } from '../../data/storage/config.js';

export function autosave() {
    var channel = bot.channels.cache.find(channel => channel.id === SAVE_CHANNEL);

    var toSend = '';

    for(const [key, value] of players.entries()) {
        var player = value;
        var output = '';

        output += `${player.name},${player.xp},`;

        for(let i=0; i<player.movelist.length; i++) {
            if(i == player.movelist.length-1) {
                output += player.movelist[i];
            }
            else {
                output += player.movelist[i]+',';
            }
        }

        output += '\n';
        toSend += output;
    }

    channel.send(toSend);
}