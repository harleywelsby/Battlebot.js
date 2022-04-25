// =============================================================
// || JavaScript Battle Bot Rewrite                           ||
// =============================================================
// || AUTHOR: Harley Welsby, https://github.com/harleywelsby  ||
// =============================================================

import { admin, AUTOSAVE_TIME } from './deployConfig.js';
import { getTimeToTrain } from './handlers.js';

//Commands
import { getMoves } from './commands/moves.js';
import { doSignup } from './commands/user/signup.js';
import { doTrain } from './commands/train.js';
import { doFightLobby } from './commands/fight.js';
import { doMoveLogic } from './commands/attack.js';
import { doProfile } from './commands/profile.js';

//Admin
import { doFinTrain } from './commands/admin/finishTraining.js';
import { doAdjust } from './commands/admin/adjust.js';
import { autosave } from './commands/admin/autosave.js';

//On message check
bot.on('messageCreate', msg => {

    if(Date.now() - parseInt(lastSave) >= AUTOSAVE_TIME) {
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
        if(!msg.author.id.startsWith(admin)) {
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
    
    //Finish all currently training moves
    else if(msg.content.startsWith('.fintrain')) {
        //Stop users other than server admin using fintrain
        if(!msg.author.id.startsWith(admin)) {
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
        if(!msg.author.id.startsWith(admin)) {
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