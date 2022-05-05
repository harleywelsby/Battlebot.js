import { TextChannel } from 'discord.js';
import { bot } from '../startup.js';
import { SaveChannel } from './storage/tokens.js';
import { players } from './database.js';
import { AUTOSAVE_TIME } from './storage/config.js';

export function getLastAutosave() {
    var channel = bot.channels.cache.find(channel => channel.id === SaveChannel);
    if (!(channel instanceof TextChannel)) { return; }
    channel.messages.fetch({ limit:  1 })
        .then(messages => {
            let lastSave = messages.first().content;
            var playerdata = lastSave.split('\n');

            for(let i=0; i<playerdata.length; i++) { 
                var values = playerdata[i].split(',');
                var player = {
                    name: values[0],
                    xp: values[1],
                    wins: values[2],
                    losses: values[3],
                    effect: null,
                    movelist: playerdata[i].split(values[0]+','+values[1]+','+values[2]+','+values[3]+',')[1].split(','),
                    lastmove: null
                }
                players.set(player.name, player);
            }
        })
        .catch(console.error);
}

export function autosave() {
    bot.channels.fetch(SaveChannel)
        .then(channel => {
            if (channel instanceof TextChannel) {
                setTimeout(function() {
                    var toSend = '';

                    players.forEach((v,k) => {
                        var output = '';
                        output += `${k},${v.xp},${v.wins},${v.losses},`;

                        for (let i = 0; i < v.movelist.length; i++) {
                            output += (i === v.movelist.length - 1) ?
                                v.movelist[i] + '\n' : v.movelist[i] + ',';
                        }

                        toSend += output;
                    });

                    channel.send(toSend);
                    autosave();
                }, AUTOSAVE_TIME);
            }
        });
}