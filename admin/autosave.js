import { players, bot } from '../battlebot.js';
import { SAVE_CHANNEL } from '../config.js';

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

export function getLastAutosave() {
    var channel = bot.channels.cache.find(channel => channel.id === SAVE_CHANNEL);
    channel.messages.fetch({ limit:  1 })
        .then(messages => {
            let lastSave = messages.first().content;
            var playerdata = lastSave.split('\n');

            for(let i=0; i<playerdata.length; i++) { 
                var values = playerdata[i].split(',');
                var player = {
                    name: values[0],
                    xp: values[1],
                    effect: null,
                    movelist: playerdata[i].split(values[0]+','+values[1]+',')[1].split(','),
                    lastmove: null
                }
                players.set(player.name, player);
            }
        })
        .catch(console.error);
}