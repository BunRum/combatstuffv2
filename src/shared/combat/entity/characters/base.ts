import {Make} from "@rbxts/altmake";
import {Workspace} from "@rbxts/services";
import {applyvelocity} from "shared/combat/physics/velocity";
import {inputOnce} from "shared/inputModule";
import {allEntities} from "../allEntities";
import {combatClassBase} from "../combatClass";
import {AnimationClass} from "shared/animationClass";

export class base extends combatClassBase {
    name = "base"

    constructor(playerOrCharacter: Player | Character, Entity: IEntity) {
        super(playerOrCharacter, Entity);
        this.Bind(Enum.KeyCode.One, this.Skill1);
        this.Bind(Enum.KeyCode.E, this.Skill2);
        this.Bind(Enum.KeyCode.C, this.Skill3);
    }

    Attack() {
        if (this.getTimeSinceTimer("Attack") >= (this.CurrentCombo < this.MaxCombo ? 0.35 : 1.5)) {
            this.resetTimer("Attack");
            this.incrementCombo();
            new AnimationClass("Attack" + this.CurrentCombo, this.character)
                .changeSpeed(1.5)
                .Play();
            const hitEntities = allEntities.getEntitiesInBox(
                this.Entity.currentCFrame(),
                new Vector3(10, 10, 10),
                this.defaultOverlapParams,
            );

            hitEntities.forEach((Ent) => {
                Ent.combat.TakeDamage(10);
            });

            return hitEntities;
        }
    }

    Block(state: inputState) {
        if (state === "down") {
        }
    }

    Skill1() {
        if (this.getTimeSinceTimer("Skill1") >= 0.33) {
            this.resetTimer("Skill1");
            new AnimationClass("test1", this.character).Play("skill1")
        }
    }

    Skill2() {
        // print("asdad")
        if (this.getTimeSinceTimer("Skill2") >= 0.3) {
            this.resetTimer("Skill2");

            const targetDisplacement = new Vector3(0, 25, 0);
            const timeToReach = 0.25;

            const initialCFrame = this.Entity.currentCFrame();
            const velocityPerFrame = targetDisplacement.mul(1 / 60).div(timeToReach);

            print(velocityPerFrame);
            let accumulatedDisplacement = new Vector3();
            let isMoving = true;
            const startTime = os.clock();

            while (isMoving) {
                const deltaTime = task.wait();
                print(accumulatedDisplacement);

                if (accumulatedDisplacement.Magnitude >= targetDisplacement.Magnitude) {
                    isMoving = false;
                    print(os.clock() - startTime);
                }
                const frameMovement = velocityPerFrame.mul(deltaTime * 60);
                accumulatedDisplacement = accumulatedDisplacement.add(frameMovement);
                this.character.HumanoidRootPart.CFrame = this.character.HumanoidRootPart.CFrame.mul(new CFrame(frameMovement));
            }

            const finalspotcalc = initialCFrame.mul(new CFrame(targetDisplacement));
            Make("Part", {Anchored: true, Parent: Workspace, CFrame: finalspotcalc, CanCollide: false});
        }
    }

    @inputOnce("down")
    Skill3() {
        applyvelocity(this.character, new Vector3(0, 0, -25), 0.25);
    }
}
