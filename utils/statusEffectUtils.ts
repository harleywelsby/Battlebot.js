import { Move } from "../data/database";
import { StatusEffect, statusEffects, MoveEffectChance } from "../data/statusEffectHandler.js";

export function checkForEffect(move : Move, chanceDisabled : boolean) : StatusEffect {

    var output : StatusEffect = undefined;

    statusEffects.forEach((v,k) => {
        v.forEach((moveEffect : MoveEffectChance) => {
            if (moveEffect.move.toLowerCase() === move.name.toLowerCase()) {
                if (!chanceDisabled) {
                    if (Math.random() <= moveEffect.chance) {
                        output = k;
                    }
                }
                else {
                    // Always output if chance isn't enabled, eg for /analyze outputs
                    output = k;
                }
            }
        });
    });

    return output;
}

export function getStatusEffectDescription(effect : StatusEffect) : string {
    switch (effect) {
        case StatusEffect.Concussion:
            return ' has been given a concussion! Their accuracy has lowered!';
        case StatusEffect.Winded:
            return ' has been winded! Their next move will have less power!';
        case StatusEffect.Dazzled:
            return ' has been dazzled! Their next move may be less effective!';
        case StatusEffect.BrokenArm:
            return '\'s arm has broken! Their punches and grapples will be less effective!';
        case StatusEffect.BrokenLeg:
            return '\'s leg has broken! Their kicks will be less effective!';
        case StatusEffect.Confused:
            return ' is confused! (&*$# (*)#&$# !@#* (@*#? ? ??';
        case StatusEffect.Demoralised:
            return ' has been demoralized! Their ranged or mental moves will be less effective!';
        case StatusEffect.Recovered:
            return ' has recovered! They have gained some health!';
    }
}