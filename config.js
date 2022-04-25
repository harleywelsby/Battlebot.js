// Config variables for BattlebotJS

// Administration

export const debug = false; // Toggle local or prod build

export function token() {
    return debug ? 
        '': 
        '';
}

export function BOT_ID() {
    return debug ?
        '':
        '';
}

export const admin = '';

export const LOG_CHANNEL = '';

export const SAVE_CHANNEL = '';

// Game functionality

export const LEVEL_CAP = 30;

export const MISS_CHANCE = 20;

export const AUTOSAVE_TIME = (60000)*60;

export const MIN_DAMAGE = 5;

export const DAMAGE_MODIFIER = 0.7;

export const EMBED_COLOUR = '#9145B6';