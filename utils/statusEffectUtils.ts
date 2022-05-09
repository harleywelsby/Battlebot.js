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