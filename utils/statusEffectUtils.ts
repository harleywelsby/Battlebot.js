import { Move } from "../data/database";
import { 
    Concussion, 
    Winded, 
    StatusEffect,
    EffectEnum, 
    Dazzled, 
    BrokenLeg, 
    BrokenArm, 
    Demoralised, 
    Confused 
} from "../data/statusEffectHandler.js";

export function getClassByEnum(effectEnum : EffectEnum) : StatusEffect {
    switch (effectEnum) {
        case EffectEnum.Concussion:
            return new Concussion();
        case EffectEnum.Winded:
            return new Winded();
        case EffectEnum.Dazzled:
            return new Dazzled();
        case EffectEnum.BrokenLeg:
            return new BrokenLeg();
        case EffectEnum.BrokenArm:
            return new BrokenArm();
        case EffectEnum.Demoralised:
            return new Demoralised();
        case EffectEnum.Confused:
            return new Confused();
    }
}

// Note recovered isn't checked here and should be done seperately TODO
export function checkForEffect(move : Move) : EffectEnum {

    var output : EffectEnum = undefined;

    new Concussion().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.Concussion : undefined;
        }
    });
    if (output) { return output; }

    new Winded().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.Winded : undefined;
        }
    });
    if (output) { return output; }

    new Dazzled().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.Dazzled : undefined;
        }
    });
    if (output) { return output; }

    new BrokenLeg().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.BrokenLeg : undefined;
        }
    });
    if (output) { return output; }

    new BrokenArm().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.BrokenArm : undefined;
        }
    });
    if (output) { return output; }

    new Demoralised().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.Demoralised : undefined;
        }
    });
    if (output) { return output; }

    new Confused().moveChance.forEach(effectMove => {
        if (effectMove.move.toLowerCase() === move.name.toLowerCase()) {
            var roll = Math.random();
            output = (roll < effectMove.chance) ? EffectEnum.Confused : undefined;
        }
    });
    if (output) { return output; }

    return undefined;
}