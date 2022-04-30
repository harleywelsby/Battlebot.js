export interface StatusEffect {
    description: string;
    moveChance: Record<string, number>; // Chance of status effect mapped to move name
    exec: (interaction : any) => any;
}

export class Concussion implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class Winded implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class Dazzled implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class BrokenLeg implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class BrokenArm implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class Demoralised implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class Confused implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}

export class Recovered implements StatusEffect {
    description: '';
    moveChance: {};
    exec: (interaction : any) => {

    };
}