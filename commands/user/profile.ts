import { MessageEmbed } from "discord.js";
import { players, ranks, Rank } from '../../data/database.js';
import { getNameFromId } from "../../handlers.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { EMBED_COLOUR } from "../../config.js";
import { bot } from "../../startup.js";
import { TextChannel } from "discord.js";

export const profile = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Check your profile and ranking');

export function doProfile(interaction : any) {
    var author = interaction.member.user;
    var xp = players.get(author.id).xp;
    
    var rank = undefined;
    ranks.forEach((v,k) => {
        var range = k.split(' ');
        if (xp >= range[0] && xp <= range[1]) {
           rank = v;
        }
    });

    if (!rank) {
        interaction.reply('An error has occured, please try again.');
        return;
    }

    const profileEmbed = new MessageEmbed()
        .setColor(EMBED_COLOUR)
        .setTitle(`${getNameFromId(author.id)}\'s Rank:`)
        .setDescription(rank.name)
        .setThumbnail(rank.pic)
        .addFields(
            { name: 'XP Left until rankup:', value: `${rank.end - xp}` }
        );

    interaction.reply(`Here\'s your rank <@${author.id}>`);

    bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                channel.send({ embeds: [profileEmbed] });
            }
            else {
                interaction.reply('An error has occured, please try again.');
            }
        });
}