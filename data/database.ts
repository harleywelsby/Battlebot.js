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
    movelist: string[];
    lastmove: Move;
}

export type Training = {
    name: string;
    level: number;
    startTime: number;
}

export type Fight = {
    player1: string;
    player2: string;
    p1hp: number;
    p2hp: number;
    turn: string;
    stage: FightStage;
    lastTurn: Move;
}

export enum FightStage {
    Lobby = 1,
    Fight
}