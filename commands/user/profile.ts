import { MessageEmbed } from "discord.js";
import { players } from '../../data/database.js';
import { getNameFromId } from "../../handlers.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export const profile = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Check your profile and ranking');

export function doProfile(interaction : any) {
    
}