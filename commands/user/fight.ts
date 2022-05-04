import { players, activeFights, Fight, FightStage } from '../../data/database.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { BOT_ID } from '../../data/storage/deployConfig.js';
import { getFightEmbed } from '../../utils/fightUtils.js';
import { bot } from '../../startup.js';
import { TextChannel } from 'discord.js';

export const fight = new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Challenge another player to a fight!')
    .addSubcommand(subcommand => 
        subcommand
            .setName('start')
            .setDescription('Start a fight with another player')
            .addUserOption(option =>
                option.setName('user')
                        .setDescription('Player to challenge')
                        .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('accept')
            .setDescription('Accept another player\'s challenge')
    )
    .addSubcommand(subcommand => 
        subcommand
            .setName('cancel')
            .setDescription('Cancel a fight lobby')
    );

export function doFight(interaction : any) {
    switch (interaction.options.getSubcommand()) {
        case ('start'):
            startFight(interaction);
            break;
        case ('accept'):
            acceptFight(interaction);
            break;
        case ('cancel'):
            cancelFight(interaction);
            break;
    }
}

// Start a new fight lobby
function startFight(interaction : any) {
    var author = interaction.member.user;
    var mention = interaction.options.getUser('user');

    // Can't challenge the bot, but you will be able to
    if (mention.id === BOT_ID()) {
        //botfight(msg); TODO
        // This was a feature on v2, but will be regressed to get a slash command prototype running
        interaction.reply('You can\'t fight me! Yet...');
        return;
    }

    // Cant challenge someone the bot doesn't know
    if (!players.has(mention.id)) {
        interaction.reply('That player hasn\'t signed up yet!');
        return;
    }

    // Can't challenge yourself
    if (author.id === mention.id) {
        interaction.reply('You can\'t challenge yourself to a fight!');
        return;
    }

    // All checks cleared
    var fight : Fight = {
        player1: mention.id,
        player2: author.id,
        p1hp: 100,
        p2hp: 100,
        turn: mention.id,
        stage: FightStage.Lobby,
        lastTurn: undefined
    }
    var fightKey = `${author.id}vs${mention.id}`;
    activeFights.set(fightKey, fight);
    interaction.reply(`<@${author.id}> has challenged <@${mention.id}>! Waiting for them to accept...`);
    return;
}

// Accept a fight challenge
function acceptFight(interaction : any) {
    var author = interaction.member.user;
    
    var found = false;
    activeFights.forEach((v,k) => {
        if (k.includes(`vs${author.id}`) && v.stage === FightStage.Lobby) {
            v.stage = FightStage.Fight;
            found = true;
            initFightArena(interaction, v);
            return;
        }
    });

    if (!found) {
        interaction.reply('You haven\'t been challenged to a fight!');
    }
}

//Initialize the arena
function initFightArena(interaction : any, fight : Fight) {
    var embed = getFightEmbed(fight, null);
    bot.channels.fetch(interaction.channelId)
        .then(channel => {
            if (channel instanceof TextChannel) {
                interaction.reply(`<@${fight.player1}> has accepted <@${fight.player2}>\'s fight! Initializing the arena...`);
                channel.send({ embeds: [embed] });
            }
            else {
                interaction.reply('An error has occured, please try again.');
            }
        });
}

// Cancel a fight challenge
function cancelFight(interaction : any) {
    var author = interaction.member.user;
    var toRemove = null;
    activeFights.forEach((v,k) => {
        if (k.includes(author.id) && v.stage === FightStage.Lobby) {
            toRemove = k;
        }
    });

    if (toRemove) {
        activeFights.delete(toRemove);
        interaction.reply('Fight successfully cancelled!');
        return;
    }

    interaction.reply('You\'re not in an active fight!');
}