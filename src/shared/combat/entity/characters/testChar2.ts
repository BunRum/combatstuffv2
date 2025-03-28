import {allEntities} from "../allEntities";
import {combatClassBase} from "../combatClass";
import {AnimationClass} from "../../../animationClass";

function reportableClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        name = "blastocyst"

    };
}

@reportableClassDecorator
export class testChar2 extends combatClassBase {
    name = "testChar2";

    constructor(playerOrCharacter: Player | Character, Entity: IEntity) {
        super(playerOrCharacter, Entity);
        this.Bind(Enum.KeyCode.T, () => this.genjimode());
    }

    Attack() {
        if (this.getTimeSinceTimer("Attack") >= (this.CurrentCombo < this.MaxCombo ? 0.3 : 1.5)) {
            this.resetTimer("Attack");
            this.incrementCombo();
            new AnimationClass("newPunch" + this.CurrentCombo, this.character)
                .changeSpeed(1.5)
                .Play();
            return allEntities.getEntitiesInBox(
                this.Entity.currentCFrame(),
                new Vector3(10, 10, 10),
                this.defaultOverlapParams,
            );
        }
    }

    genjimode() {
        print("going genji mode");
    }
}

