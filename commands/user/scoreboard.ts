import { SlashCommandBuilder } from '@discordjs/builders';
import { players } from '../../data/database.js';

export const scoreboard = new SlashCommandBuilder()
    .setName('scoreboard')
    .setDescription('See the top Battlebot scores');

type PlayerScore = {
    name: string;
    wins: number;
    losses: number;
}

export function doScoreboard(interaction : any) {
    // Eventually this should cap at something like top 10 players, but since
    // this bot is only going to be used in a small server, it can be left for now.
    var output = "__**Battlebot Scoreboard:**__\n";
    var playerList : PlayerScore[] = [];
    players.forEach((v,k) => {
        playerList.push({
            name: `<@${k}>`,
            wins: v.wins,
            losses: v.losses
        });
    });

    while (playerList.length > 0) {
        var highestScore = getHighestScore(playerList);
        if (highestScore.wins === undefined) {
            highestScore.wins = 0;
        }
        if (highestScore.losses === undefined) {
            highestScore.losses = 0;
        }
        output += `${highestScore.name} - ${highestScore.wins}-${highestScore.losses} (${getKD(highestScore.wins, highestScore.losses)} K/D)\n`;
        playerList.splice(playerList.indexOf(highestScore), 1);
    }

    interaction.reply({
        content: output, 
        ephemeral: true
    });
}

function getHighestScore(scores : PlayerScore[]) : PlayerScore {
    var max : PlayerScore = scores[0];
    scores.forEach(score => {
        if (max.wins < score.wins) {
            max = score;
        }
    });
    return max;
}

function getKD(wins : number, losses : number) : number {
    return (losses == 0) ? wins : wins / losses;
}