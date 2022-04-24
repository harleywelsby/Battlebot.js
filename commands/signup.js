import { moves, players } from '../data/database.js';
import { sortList, getRandomInt } from '../handlers.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const signup = new SlashCommandBuilder()
    .setName('signup')
    .setDescription('Signs you up to the Battlebot and gives you some starting moves!');

//Sign up to the bot
export async function doSignup(msg) {
    if(players.has(msg.author.id)){
        msg.reply('You\'ve already signed up!');
    }
    else {
        //Sort the moves by type
        var punchlist = [];
        var kicklist = [];
        var grapplelist = [];
        sortList(moves, punchlist, 'Punch');
        sortList(moves, kicklist, 'Kick');
        sortList(moves, grapplelist, 'Grapple');

        //Distribute 3 at random
        var playermoves = [];
        playermoves.push(3 + ' ' + punchlist[getRandomInt(punchlist.length)].name);
        playermoves.push(3 + ' ' + kicklist[getRandomInt(kicklist.length)].name);
        playermoves.push(3 + ' ' + grapplelist[getRandomInt(grapplelist.length)].name);

        //Add player to db
        var player = {
            name: msg.author.id,
            xp: 0,
            effect: null,
            movelist: playermoves,
            lastmove: null
        }
        players.set(msg.author.id, player)

        //Respond
        msg.reply('Welcome to BattleBot <@'+msg.author.id+'>!\nYou\'ll start with some basic moves.\n To see the commands, type .help\n good luck!');
    }
}