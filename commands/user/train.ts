import { moves, activeTraining, players, Player, Move, Training } from '../../data/database.js';
import { LevelCap } from '../../config/config.js';
import { getTimeLeft, getTimeToTrain } from '../../utils/moveUtils.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { bot } from '../../startup.js';
import { TextChannel, User } from 'discord.js';

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
        if (selectedMove.level >= LevelCap) {
            interaction.reply('You\'ve already reached max level for this move!');
            return;
        }

        var training : Training = {
            name: selectedMove.name,
            level: selectedMove.level + 1,
            startTime: Date.now()
        }
        trainOnThread(interaction, training, author);

        interaction.reply(`Training ${training.name} to level ${training.level}... This may take a while... (${getTimeToTrain(training)} mins)`);
        return;
    }

    // Player doesn't have the move
    var training : Training = {
        name: moves.get(moveName).name,
        level: 1,
        startTime: Date.now()
    }
    trainOnThread(interaction, training, author);

    interaction.reply(`Training ${training.name} to level 1... This may take a while... (${getTimeToTrain(training)} mins)`);
}

export function trainOnThread(interaction : any, training : Training, author : User) {
    // Start a new thread training the move
    activeTraining.set(author.id, training);
    setTimeout(function() {
        bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                channel.send(`<@${author.id}> your ${training.name} has reached level ${training.level}!`);
                activeTraining.delete(author.id);
                if (training.level === 1) {
                    players.get(author.id).movelist.push(`1 ${training.name}`);
                    return;
                }
                else {
                    var player : Player = players.get(author.id);
                    for (let i = 0; i < player.movelist.length; i++) {
                        var check = player.movelist[i].split(' ')[1];
                        if (check.toLowerCase() === training.name.toLowerCase()) {
                            players.get(author.id).movelist[i] = `${training.level} ${training.name}`;
                            return;
                        }
                    }
                }
            }
        });
    }, getTimeToTrain(training) * 60000);
}