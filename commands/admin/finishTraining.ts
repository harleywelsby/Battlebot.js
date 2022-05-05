import { SlashCommandBuilder } from '@discordjs/builders';
import { activeTraining, players, Player } from '../../data/database.js';
import { bot, DiscordLogChannel } from '../../startup.js';
import { TextChannel } from 'discord.js';
import { AdminId } from '../../data/storage/tokens.js';

export const finishTraining = new SlashCommandBuilder()
    .setName('fintrain')
    .setDescription('Finish all training (Admin only!)');

export function doFinishTraining(interaction : any) {
    if (interaction.member.user.id !== AdminId) {
        interaction.reply('You need to be an admin to do that!');
        return;
    }

    bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                activeTraining.forEach((v,k) => {
                    channel.send(`<@${k}> your ${v.name} has reached level ${v.level}!`);
                    if (v.level === 1) {
                        players.get(k).movelist.push(`1 ${v.name}`);
                        return;
                    }
                    else {
                        var player : Player = players.get(k);
                        for (let i = 0; i < player.movelist.length; i++) {
                            var check = player.movelist[i].split(' ')[1];
                            if (check.toLowerCase() === v.name.toLowerCase()) {
                                players.get(k).movelist[i] = `${v.level} ${v.name}`;
                                return;
                            }
                        }
                    }
                });
                activeTraining.clear();
            }
            else {
                DiscordLogChannel.send("Error in fintrain: Could not find text channel");
            }
            interaction.reply({
                content: 'All moves have been finished!',
                ephemeral: true
            })
        });
}