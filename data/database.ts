export var moves = new Map();
export var players = new Map();
export var activeTraining = new Map();
export var activeFights = new Map();
export var ranks = new Map();

export type Move = {
    name: string;
    type: MoveType;
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

export enum MoveType {
    Punch = 1,
    Kick,
    Grapple
}

export type Rank = {
    name: string;
    start: number;
    end: number;
    pic: string;
}