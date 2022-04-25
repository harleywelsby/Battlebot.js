export var moves = new Map();
export var players = new Map();
export var activeTraining = new Map();
export var activeFights = new Map();

export type Move = {
    name: string;
    type: string;
    damage: number;
    level: number;
}

export type Player = {
    name: string;
    xp: number;
    effect: string;
    movelist: Move[];
    lastmove: Move;
}