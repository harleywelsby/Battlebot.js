// =============================================================
// || JavaScript Battle Bot Rewrite                           ||
// =============================================================
// || AUTHOR: Harley Welsby, https://github.com/harleywelsby  ||
// =============================================================

import { token, admin, LOG_CHANNEL, AUTOSAVE_TIME } from './config.js';
import { Client, Intents } from 'discord.js';
import { getTimeToTrain } from './handlers.js';
import Papa from 'papaparse';
import * as fs from 'fs';

//Commands
import { getMoves } from './commands/moves.js';
import { doSignup } from './commands/signup.js';
import { doTrain } from './commands/train.js';
import { doFightLobby } from './commands/fight.js';
import { doMoveLogic } from './commands/attack.js';
import { doProfile } from './commands/profile.js';

//Admin
import { doFinTrain } from './admin/finishTraining.js';
import { doAdjust } from './admin/adjust.js';
import { autosave, getLastAutosave } from './admin/autosave.js';

//FILES
var movefile = './data/moves.csv';
var lastSave = null;

//DATA
export var moves = new Map();
export var players = new Map();
export var activeTraining = new Map();
export var activeFights = new Map();

//INITIALIZATIONS
export const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Login
bot.on('ready', () => {
    console.log('logged in!');
    bot.user.setActivity('everything WORK', { type: 'WATCHING' });
    var channel = bot.channels.cache.find(channel => channel.id === LOG_CHANNEL());
    channel.send(`Rebooted and logged in`);
    doFiles();
});

//Load data
function doFiles() {
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
    lastSave = Date.now();
    console.log('Players initialized!');
}

//On message check
bot.on('messageCreate', msg => {

    if(Date.now() - parseInt(lastSave) >= AUTOSAVE_TIME()) {
        autosave();
        lastSave = Date.now();
    }

    var toRemoveKeys = [];

    //Check and finish moves in training
    for(const [key, value] of activeTraining.entries()) {

        var move = { name: value.name, level: value.level }

        if((Date.now() - (getTimeToTrain(move)*60000) >= value.start)) { 
            
            //Reply
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
    }

    //Remove the moves that have finished training
    for(let i=0; i<toRemoveKeys.length; i++) {
        activeTraining.delete(toRemoveKeys[i]);
    }

    //Check player's movelist
    if (msg.content.startsWith('.moves')) {
       getMoves(msg);
    }
    
    //Sign up to the bot and assign random moves
    else if (msg.content.startsWith('.signup')) {
       doSignup(msg);
    }

    else if (msg.content.startsWith('.save')) {
        if(!msg.author.id.startsWith(admin())) {
            msg.reply('You don\'t have permission to do that!');
            return;
        }
        else {
            autosave();
            msg.reply('Save completed!');
        }
    }

    //Train up a move
    else if (msg.content.startsWith('.train')) {
       doTrain(msg);
    }

    else if (msg.content.startsWith('.help')) {
        msg.reply('Help can be found on the Battlebot Wiki: https://github.com/harleywelsby/Battlebot.js/wiki');
    }

    //Handle fight commands
    else if(msg.content.startsWith('.fight')) {
        doFightLobby(msg);
    }

    else if(msg.content.startsWith('.profile') || msg.content.startsWith('.rank')) {
        doProfile(msg);
    }

    //Admin debug command (Current thing being tested)
    else if(msg.content.startsWith('.debug')) {
        //getLastAutosave();
        //autosave();
    }
    
    //Finish all currently training moves
    else if(msg.content.startsWith('.fintrain')) {
        //Stop users other than server admin using fintrain
        if(!msg.author.id.startsWith(admin())) {
            msg.reply('You don\'t have permission to do that!');
            return;
        }
        //Go ahead with the command
        else {
            doFinTrain(msg);
        }
    }

    else if(msg.content.startsWith('.adjust')) {
        //Stop users other than server admin using adjust
        if(!msg.author.id.startsWith(admin())) {
            msg.reply('You don\'t have permission to do that!');
            return;
        }
        //Go ahead with the command
        else {
            doAdjust(msg);
        }
    }

    else if(msg.content.startsWith('.attack') || msg.content.startsWith('.a')) {
        doMoveLogic(msg);
    }
});

bot.login(token());