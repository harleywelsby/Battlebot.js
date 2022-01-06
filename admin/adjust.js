import { players } from "../battlebot.js";

export function doAdjust(msg) { 
    var args = msg.content.split(' ');

    if (args.length < 3) {
        msg.reply('Incorrect arguments. Try \".adjust move\" or \".adjust rank\"');
        return;
    }

    if (args[1].startsWith('move')) {
        if (players.has(args[2])) {
            var player = players.get(args[2]);
            for(let i=0; i<player.movelist.length; i++) {
                if (player.movelist[i].split(' ')[1].toLowerCase().startsWith(args[3].toLowerCase())) {
                    players.get(args[2]).movelist[i] = args[4] + ' ' + args[3].toLowerCase();
                    msg.reply('Move has been adjusted!');
                    return;
                }
            }
    
            player.movelist.push(args[4] + ' ' + args[3].toLowerCase());
            msg.reply('Move has been added!');
        }
    }

    else if (args[1].startsWith('rank')) {
        if (players.has(args[2])) {
            players.get(args[2]).xp = args[3];
            msg.reply('Rank adjusted!');
            return;
        }
    }
}