import { players, activeFights } from '../battlebot.js';
import { MessageEmbed } from 'discord.js';
import { getNameFromId } from '../handlers.js';
import { BOT_ID } from '../config.js';
import { botfight } from './botfight.js';

//Return a message embed for a fight turn
export function getFightEmbed(fight, move) {

    var moveDescription = (move === null) ? 'The fight has begun! it is ' + `${getNameFromId(fight.player1)}` + '\'s first move!' : move;

    const fightEmbed = new MessageEmbed()
        .setColor('#9145B6')
        .setTitle(`${getNameFromId(fight.player1)}` + ' vs ' + `${getNameFromId(fight.player2)}`)
        .setDescription(moveDescription)
        .addFields(
            { name: `${getNameFromId(fight.player1)}`, value: 'HP: ' + fight.p1hp, inline: true },
            { name: `${getNameFromId(fight.player2)}`, value: 'HP: ' + fight.p2hp, inline: true }
        )

    return fightEmbed;
}

//Initialize the arena
export function initFightArena(msg, fight) {
    var embed = getFightEmbed(fight, null);
    msg.channel.send({ embeds: [embed] });
}

//Handle .fight (player) and .fight accept
export function doFightLobby(msg) {
    
    //Format checking
    if(msg.content.split(' ').length < 2) {
        msg.reply('Incorrect arguments! Use .fight (player) or .fight accept');
        return;
    }

    else {

        if(!players.has(msg.author.id)) {
            msg.reply('You need to sign up first! Use \".signup\"!');
            return;
        }
        
        var args = msg.content.split(' ');
        
        //Accept a fight
        if(args[1].toLowerCase().startsWith('accept')) {
            
            var found = false;
            
            for(const [key, value] of activeFights.entries()) {
                if(key.includes('vs'+msg.author.id) && value.stage.startsWith('LOBBY')) {
                    msg.reply('<@' + msg.author.id + '> has accepted <@' + value.player2 + '>\'s fight! Initializing the arena...');
                    value.stage = 'FIGHT';
                    found = true;
                    initFightArena(msg, activeFights.get(key));
                    break;
                }
            }

            //No fight exists
            if(found === false) {
                msg.reply('You haven\'t been challenged to a fight!');
                return;
            }
        }   

        //Cancel a fight lobby
        else if(args[1].toLowerCase().startsWith('cancel')) {
            var toRemove = null;
            for(const [key, value] of activeFights.entries()) {
                if (key.includes(msg.author.id) && value.stage.startsWith('LOBBY')) {
                    toRemove = key;
                }
            }
            
            if(toRemove == null) {
                msg.reply('You\'re not in an active fight!');
                return;
            }
            else {
                activeFights.delete(toRemove);
                msg.reply('Fight successfully cancelled!');
                return;
            }
        }

        else if(msg.mentions.users.first().id.startsWith(BOT_ID())) {
            botfight(msg);
            return;
        }
        
        else {
            
            //Don't start a lobby if player is already in one
            for(const [key] of activeFights.entries()) {
                if(key.includes(msg.author.id)) {
                    msg.reply('You\'re already in a fight!');
                    return;
                }
            }
            
            //Start a new fight lobby
            if(players.has(msg.mentions.users.first().id)) {

                if(msg.mentions.users.first().id === msg.author.id) {
                    msg.reply('You can\'t challenge yourself to a fight!');
                    return;
                }

                var fight = {
                    player1: msg.mentions.users.first().id,
                    player2: msg.author.id,
                    p1hp: 100,
                    p2hp: 100,
                    turn: msg.mentions.users.first().id,
                    stage: 'LOBBY',
                    lastTurn: null
                }
                activeFights.set(msg.author.id + 'vs' + msg.mentions.users.first().id, fight);
                msg.reply('<@' + msg.author.id + '> has challenged <@' + msg.mentions.users.first().id + '>! Waiting for them to accept...');
                return;
            }
            
            else {
                msg.reply('That player doesn\'t exist!');
                return;
            }

        }
    }
}