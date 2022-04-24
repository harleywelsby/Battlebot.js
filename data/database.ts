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