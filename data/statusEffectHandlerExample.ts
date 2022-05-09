export enum Chance {
    VeryHigh = 0.9,
    High = 0.7,
    Medium = 0.5,
    Low = 0.3,
    VeryLow = 0.1,
    Self = 0.7 // Used for self-inflicting effects like Recover
}

export enum StatusEffect {
    Concussion,
    Winded,
    Dazzled,
    BrokenLeg,
    BrokenArm,
    Demoralised,
    Confused,
    Recovered
}

export type MoveEffectChance = {
    move: string;
    chance: Chance;
}

export var statusEffects = new Map(); 

export function loadStatusEffects() {
    // These set calls should contain arrays of MoveEffectChance instances for each move,
    // For exmaple: { move: punch, chance: Chance.High }
    statusEffects.set(StatusEffect.Concussion, Array.of(
    ));
    statusEffects.set(StatusEffect.Winded, Array.of(
    ));
    statusEffects.set(StatusEffect.Dazzled, Array.of(
    ));
    statusEffects.set(StatusEffect.BrokenLeg, Array.of(
    ));
    statusEffects.set(StatusEffect.BrokenArm, Array.of(
    ));
    statusEffects.set(StatusEffect.Demoralised, Array.of(
    ));
    statusEffects.set(StatusEffect.Confused, Array.of(
    ));
    // TODO Recovered isn't fully implemented yet, and is still a work in progress
    statusEffects.set(StatusEffect.Recovered, Array.of(
    ));
}