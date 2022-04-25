import { bot } from "../startup.js";

//Get player name from ID
export function getNameFromId(id) {
    return bot.users.cache.find(user => user.id === id).username;
}