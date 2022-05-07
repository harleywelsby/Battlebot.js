import { Move, MoveType, Training } from '../data/database.js';
import { DAMAGE_MODIFIER, LEVEL_CAP, MIN_DAMAGE } from '../data/storage/config.js';
import { MISS_CHANCE } from '../data/storage/deployConfig.js';

// Calculate move damage with modifiers
export function getMoveDamage(move : Move) : number {
    var toHit : number = move.damage + (move.level * DAMAGE_MODIFIER);
    return toHit > MIN_DAMAGE ? toHit : MIN_DAMAGE;
}

// Get move as a string
export function getMoveString(move : Move) : string {
    return `${move.name} \t | ${getMoveDamage(move)}dmg | ${getMoveAccuracy(move)}acc\n`;
}

// Calculate move accuracy
export function getMoveAccuracy(move : Move) : number {
    var miss : number = move.level;
    miss -= LEVEL_CAP - (move.level);
    miss -= move.damage * (-move.level / MIN_DAMAGE);

    return (miss < -15) ? miss : -15;
}

// Convert move string to enum
export function moveStringToEnum(typeString : string) : MoveType {
    typeString = typeString.toLowerCase();
    switch (typeString) {
        case 'punch':
            return MoveType.Punch;
        case 'kick':
            return MoveType.Kick;
        case 'grapple':
            return MoveType.Grapple;
        case 'ranged':
            return MoveType.Ranged;
        case 'mental':
            return MoveType.Mental;
        case 'slam':
            return MoveType.Slam;
    }
}

// Convert move enum to string
export function moveEnumToString(moveType : MoveType) : string {
    switch (moveType) {
        case MoveType.Punch:
            return 'punch';
        case MoveType.Kick:
            return 'kick';
        case MoveType.Grapple:
            return 'grapple';
        case MoveType.Ranged:
            return 'ranged';
        case MoveType.Mental:
            return 'mental';
        case MoveType.Slam:
            return 'slam';
    }
}

//Calculate time training should take
export function getTimeToTrain(move : Training) {
    return (move.level / 5) * 15;
}

//Calculate how much time is left on active training in seconds
export function getTimeLeft(move : Training) {
    var trainTime = getTimeToTrain(move) * 60;
    var now = Date.now();
    var sofar = (now - move.startTime)/1000;
    return trainTime - sofar;
}

// Calculate move type modifiers
export function getBuffByLastMove(type : MoveType, lastType : MoveType) : number {
    switch (type) {
        case MoveType.Punch:
            switch (lastType) {
                case MoveType.Kick:
                    return 0.5;
                case MoveType.Grapple:
                    return 1.5;
                case MoveType.Ranged:
                    return 0.25;
                case MoveType.Mental:
                    return 1.25;
                case MoveType.Slam:
                    return 1.25;
            }
        case MoveType.Kick:
            switch (lastType) {
                case MoveType.Punch:
                    return 1.5;
                case MoveType.Grapple:
                    return 0.5;
                case MoveType.Ranged:
                    return 0.5;
                case MoveType.Mental:
                    return 1.25;
                case MoveType.Slam:
                    return 1.75;
            }
        case MoveType.Grapple:
            switch (lastType) {
                case MoveType.Punch:
                    return 1.5;
                case MoveType.Kick:
                    return 1.5;
                case MoveType.Ranged:
                    return 0.25;
                case MoveType.Slam:
                    return 0.75;
            }
        case MoveType.Ranged:
            switch (lastType) {
                case MoveType.Punch:
                    return 1.75;
                case MoveType.Kick:
                    return 1.75;
                case MoveType.Grapple:
                    return 1.75;
                case MoveType.Mental:
                    return 0.25;
                case MoveType.Slam:
                    return 0.25;
            }
        case MoveType.Mental:
            switch (lastType) {
                case MoveType.Kick:
                    return 0.5;
                case MoveType.Ranged:
                    return 2.0;
                case MoveType.Mental:
                    return 1.5;
                case MoveType.Slam:
                    return 0.5;
            }
        case MoveType.Slam:
            switch (lastType) {
                case MoveType.Punch:
                    return 0.75;
                case MoveType.Kick:
                    return 0.5;
                case MoveType.Grapple:
                    return 1.25;
                case MoveType.Ranged:
                    return 1.75;
                case MoveType.Mental:
                    return 1.5;
            }
    }
}