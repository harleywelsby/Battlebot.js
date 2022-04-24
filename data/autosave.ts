import { TextChannel } from 'discord.js';
import { bot } from '../startup.js';
import { SaveChannel } from '../tokens.js';
import { players } from './database.js';

var lastSave : number = Date.now();

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
                    effect: null,
                    movelist: playerdata[i].split(values[0]+','+values[1]+',')[1].split(','),
                    lastmove: null
                }
                players.set(player.name, player);
            }
        })
        .catch(console.error);
}

export function setLastSave() {
    lastSave = Date.now();
}