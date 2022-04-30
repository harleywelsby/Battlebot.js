import { moves, MoveType, players } from '../../data/database.js';
import { getRandomInt } from '../../utils/sharedUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const signup = new SlashCommandBuilder()
    .setName('signup')
    .setDescription('Signs you up to the Battlebot!');

//Sign up to the bot
export async function doSignup(interaction) {
    var author = interaction.member.user;
    
    if(players.has(author.id)){
        interaction.reply('You\'ve already signed up!');
    }
    else {
        //Sort the moves by type
        var valueArray = Array.from(moves.values());
        var punchlist = valueArray.filter(move => move.type === MoveType.Punch);
        var kicklist = valueArray.filter(move => move.type === MoveType.Kick);
        var grapplelist = valueArray.filter(move => move.type === MoveType.Grapple);
        var rangedlist = valueArray.filter(move => move.type === MoveType.Ranged);
        var mentallist = valueArray.filter(move => move.type === MoveType.Mental);
        var bodyslamlist = valueArray.filter(move => move.type === MoveType.Slam);


        //Distribute 3 at random
        var playermoves = [];
        playermoves.push(3 + ' ' + punchlist[getRandomInt(punchlist.length)].name);
        playermoves.push(3 + ' ' + kicklist[getRandomInt(kicklist.length)].name);
        playermoves.push(3 + ' ' + grapplelist[getRandomInt(grapplelist.length)].name);
        playermoves.push(3 + ' ' + rangedlist[getRandomInt(rangedlist.length)].name);
        playermoves.push(3 + ' ' + mentallist[getRandomInt(mentallist.length)].name);
        playermoves.push(3 + ' ' + bodyslamlist[getRandomInt(bodyslamlist.length)].name);

        //Add player to db
        var player = {
            name: author.id,
            xp: 0,
            effect: null,
            movelist: playermoves,
            lastmove: null
        }
        players.set(author.id, player)

        //Respond
        interaction.reply(`Welcome to BattleBot <@${author.id}>!\nYou\'ll start with some basic moves.\n To see the commands, type .help\n good luck!`);
    }
}