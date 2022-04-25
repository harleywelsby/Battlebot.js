// Work in progress as a slash command TODO

import { players } from '../../data/database.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const adjust = new SlashCommandBuilder()
    .setName('adjust')
    .setDescription('Adjust a player\'s move level or rank')
    .addStringOption(option => 
        option.setName('attribute')
              .setDescription('Thing to be adjusted')
              .setRequired(true)
              .addChoice('Move', 'move')
              .addChoice('Rank', 'rank')
    )
    .addUserOption(option => 
        option.setName('player')
              .setDescription('Player to adjust')
              .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName('level')
              .setDescription('New level for this attribute')
              .setRequired(true)
    );

/*export function doAdjust(interaction) {
    // Permission check
    var author = interaction.member.user;
    if (!(author.id === AdminId)) {
        interaction.reply('You don\'t have permission to do that!');
        return;
    }

    var player = interaction.options.getUser('player');
    var newLevel = interaction.options.getInteger('level');

    // Unkown target player
    if (!players.has(player.id)) {
        interaction.reply('I don\'t know that player');
        return;
    }

    // Adjust move
    if (interaction.options.getString('attribute') === 'move') {
        var playerEntry = players.get(player.id);
        player.movelist.forEach(move => {
            if (move.name === )
        });
    }

    // Adjust rank
    if (interaction.options.getString('attribute') === 'rank') {

    }
}*/

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
                    players.get(args[2]).movelist[i] = args[4] + ' ' + args[3];
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