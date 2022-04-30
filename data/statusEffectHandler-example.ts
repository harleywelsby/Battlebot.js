export interface StatusEffect {
    description: string;
    moveChance: Record<string, Chance>; // Chance of status effect mapped to move name
    exec(interaction : any): any;
}

export enum Chance {
    VeryHigh = 0.9,
    High = 0.7,
    Medium = 0.5,
    Low = 0.3,
    VeryLow = 0.1
}

export class Concussion implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class Winded implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class Dazzled implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class BrokenLeg implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class BrokenArm implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class Demoralised implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class Confused implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}

export class Recovered implements StatusEffect {
    description: '';
    moveChance: {};
    exec(interaction : any) {

    }
}