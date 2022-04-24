import { MessageEmbed } from "discord.js";
import { players } from '../data/database.js';
import { getNameFromId } from "../handlers.js";

export function doProfile(msg) {
    var xp = players.get(msg.author.id).xp;
    var rank = getRankName(xp);

    const profileEmbed = new MessageEmbed()
        .setColor('#9145B6')
        .setTitle(`${getNameFromId(msg.author.id)}\'s Rank:`)
        .setDescription(rank.name)
        .setThumbnail(rank.pic)
        .addFields(
            { name: 'XP Left until rankup:', value: ''+rank.xpleft }
        );
    
    msg.channel.send({ embeds: [profileEmbed] });
}

function getRankName(xp) {
    if (xp < 100) {
        var rank = {
            name: '',
            xpleft: parseInt(100 - xp),
            pic: ''
        };
    }
    else if (xp < 200) {
        var rank = {
            name: '',
            xpleft: parseInt(200 - xp),
            pic: ''
        };
    }
    else if (xp < 300) {
        var rank = {
            name: '',
            xpleft: parseInt(300 - xp),
            pic: ''
        };
    }
    else if (xp < 500) {
        var rank = {
            name: '',
            xpleft: parseInt(500 - xp),
            pic: ''
        };
    }
    else if(xp < 650) {
        var rank = {
            name: '',
            xpleft: parseInt(650 - xp),
            pic: ''
        };
    }
    else if(xp < 800) {
        var rank = {
            name: '',
            xpleft: parseInt(800 - xp),
            pic: ''
        };
    }
    else if(xp < 1000) {
        var rank = {
            name: '',
            xpleft: parseInt(1000 - xp),
            pic: ''
        };
    }
    else if(xp < 1500) {
        var rank = {
            name: '',
            xpleft: parseInt(1500 - xp),
            pic: ''
        };
    }
    else if(xp < 2000) {
        var rank = {
            name: '',
            xpleft: parseInt(2000 - xp),
            pic: ''
        };
    }
    else if(xp < 3000) {
        var rank = {
            name: '',
            xpleft: parseInt(3000 - xp),
            pic: ''
        };
    }
    else if(xp < 5000) {
        var rank = {
            name: '',
            xpleft: parseInt(5000 - xp),
            pic: ''
        };
    }
    else if(xp > 5100) {
        xp = 5100;
    }
    
    if(xp >= 5000 && xp <= 5100) {
        var rank = {
            name: '',
            xpleft: parseInt(0),
            pic: ''
        };
    }

    return rank;
}