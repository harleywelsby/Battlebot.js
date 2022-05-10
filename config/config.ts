// JSON import stuff, see here:
// https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Tokens and IDs
export var Token : string;
export var BotId : string;
export var AdminId : string;
export var LogChannel : string;
export var SaveChannel : string;
export var GuildId : string;
export var ClientId : string;

// Gameplay modifiers
export var LevelCap : number;
export var MissChance : number;
export var AutosaveInterval : number;
export var MinDamage : number;
export var MinAccuracy : number;
export var DamageModifier : number;
export var EmbedColour : string;
export var DamageBooster : number;

export function LoadTokenConfig() {
    var json : JSON = require('./TokenConfig.json');
    Token = json["Token"];
    BotId = json["BotId"];
    AdminId = json["AdminId"];
    LogChannel = json["LogChannel"];
    SaveChannel = json["SaveChannel"];
    GuildId = json["GuildId"];
    ClientId = json["ClientId"];
}

export function LoadGameConfig() {
    var json : JSON = require('./GameConfig.json');
    LevelCap = json["LevelCap"];
    MissChance = json["MissChance"];
    AutosaveInterval = json["AutosaveInterval"];
    MinDamage = json["MinDamage"];
    DamageModifier = json["DamageModifier"];
    EmbedColour = json["EmbedColour"];
    DamageBooster = json["DamageBooster"];
    MinAccuracy = json["MinAccuracy"];
}