import { moves, activeTraining, players, Player, Move, Training } from '../../data/database.js';
import { LEVEL_CAP } from '../../data/storage/config.js';
import { getTimeLeft, getTimeToTrain } from '../../utils/moveUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { bot } from '../../startup.js';
import { TextChannel } from 'discord.js';

export const train = new SlashCommandBuilder()
    .setName('train')
    .setDescription('Train a new move, or level up an existing one')
    .addStringOption(option =>
        option.setName('move')
              .setDescription('Move to be trained')
              .setRequired(true)
    );

export function doTrain(interaction : any) {
    var author = interaction.member.user;

    // Check for already active training
    if (activeTraining.has(author.id)) {
        var move = activeTraining.get(author.id);
        var time = Math.round(getTimeLeft(move) / 60);
        interaction.reply(`You\'re already training ${move.name}! Come back in ${time} minutes!`);
        return;
    }

    var player : Player = players.get(author.id);
    var moveName : string = interaction.options.getString('move').toLowerCase();
    var selectedMove : Move = undefined;

    // Check move exists
    if (!moves.has(moveName)) {
        interaction.reply('That move doesn\'t exist!');
        return;
    }

    for (let i = 0; i < player.movelist.length; i++) {
        var playerMove = player.movelist[i].split(' ')[1].toLowerCase();
        if (moveName === playerMove) {
            selectedMove = moves.get(playerMove);
            selectedMove.level = parseInt(player.movelist[i].split(' ')[0]);
            break;
        }
    }

    // Player has the move
    if (selectedMove != undefined) {

        // Enforce level cap
        if (selectedMove.level >= LEVEL_CAP) {
            interaction.reply('You\'ve already reached max level for this move!');
            return;
        }

        var training : Training = {
            name: selectedMove.name,
            level: selectedMove.level + 1,
            startTime: Date.now()
        }
        activeTraining.set(author.id, training);

        interaction.reply(`Training ${training.name} to level ${training.level}... This may take a while... (${getTimeToTrain(training)} mins)`);
        return;
    }

    // Player doesn't have the move
    var training : Training = {
        name: moves.get(moveName).name,
        level: 1,
        startTime: Date.now()
    }
    activeTraining.set(author.id, training);
    interaction.reply(`Training ${training.name} to level 1... This may take a while... (${getTimeToTrain(training)} mins)`);
}

export function checkTraining(interaction : any) {
    bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                var toRemoveKeys = [];
                activeTraining.forEach((v,k) => {
                    if ((Date.now()) - (getTimeToTrain(v) * 60000) >= v.startTime) {
                        channel.send(`<@${k}> your ${v.name} has reached level ${v.level}!`);

                        var found = false;
                        players.get(k).movelist.forEach((moveString : string) => {
                            if (moveString.split(' ')[1].toLowerCase() === v.name.toLowerCase()) {
                                found = true;
                                var index = players.get(k).movelist.indexOf(moveString);
                                players.get(k).movelist[index] = `${v.level} ${v.name}`;
                                return;
                            }
                        });

                        if (!found) {
                            players.get(k).movelist.push(`${v.level} ${v.name}`);
                        }

                        toRemoveKeys.push(k);
                    }
                });
                toRemoveKeys.forEach(key => activeTraining.delete(key));
            }
        });
}