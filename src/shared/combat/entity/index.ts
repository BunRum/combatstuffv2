import Object from "@rbxts/object-utils";
import {Players, RunService} from "@rbxts/services";
import {t} from "@rbxts/t";
import {track} from "shared/animationPlayer";
import {unbindAction} from "shared/inputModule";
import {getLocalPlayer} from "shared/Utilities/misc";
import {base} from "./characters/base";
import {testChar2} from "./characters/testChar2";

export const allCombatClasses: Record<string, new (playerOrCharacter: Player | Character, Entity: IEntity) => ICombatClass> = {
    base: base,
    testChar2: testChar2,
};

const setCharGroup = (ch: Character) => {
    const n = ["Left Arm", "Right Arm"]
    ch.GetChildren().filter(i => i.IsA("BasePart")).forEach(bp => n.includes(bp.Name) ? bp.CollisionGroup = "arm" : bp.CollisionGroup = "char");
};

export class EntityClass {
    player?: Player;
    character!: Character;
    humanoid: Humanoid;
    combat!: ICombatClass;
    coreAnimation!: AnimationTrack;
    defaultWalkSpeed = 16;
    defaultJumpPower = 35;

    constructor(predefinedEntity: unknown);
    constructor(playerOrCharacter: Player | Character, className?: string);
    constructor(
        playerOrCharacterORpredefinedEntity: (Player | Character) | (unknown) = Players.LocalPlayer,
        className?: string,
    ) {
        const isPlayer = t.instanceIsA("Player")(playerOrCharacterORpredefinedEntity);
        const isCharacter = (t.instanceIsA("Model") as t.check<Character>)(playerOrCharacterORpredefinedEntity);
        const isEntity = (t.table as t.check<IEntity>)(playerOrCharacterORpredefinedEntity)

        if (isPlayer) {
            this.player = playerOrCharacterORpredefinedEntity;
            this.character = (this.player.Character ?? this.player.CharacterAdded.Wait()[0]) as Character;
        } else if (isCharacter) {
            this.character = playerOrCharacterORpredefinedEntity;
        } else if (isEntity) {
            const predefinedEntity = playerOrCharacterORpredefinedEntity;
            this.player = predefinedEntity.player;
            this.character = predefinedEntity.character;
            className = predefinedEntity.combat?.name;
        }

        setCharGroup(this.character)
        print(this.character, this.player);

        this.humanoid = this.character.Humanoid;
        this.humanoid.WalkSpeed = this.defaultWalkSpeed;
        this.humanoid.JumpPower = this.defaultJumpPower;

        this.assignClass(className ?? "base");
        this.humanoid.Died.Connect(() => {
            if (this.player) {
                this.character = this.player.CharacterAdded.Wait()[0] as Character;
                this.assignClass(className ?? "base");
            }
        });

        if (
            (!RunService.IsServer() && this.player === getLocalPlayer())
            || (RunService.IsServer() && this.player === undefined)
        ) {
            // this.character.FindFirstChild("Animate")?.Destroy()
            this.humanoid.Running.Connect((speed) => {
                speed /= 1;
                if (speed > 0.01) {
                    if (speed <= 17) {
                        this.playAnimation("Walk", 1, true);
                    } else {
                        if (speed <= 25) {
                            this.playAnimation("Sprint", 1, true);
                        } else {
                            this.playAnimation("Sprint", speed / 14.5, true);
                        }
                    }
                } else {
                    this.playAnimation("Idle", 1, true);
                }
            });
        }
    }

    assignClass(className: string) {
        const Class = allCombatClasses[className];
        if (this.combat) {
            unbindAction(...Object.keys(this.combat.Keybinds));
        }
        this.combat = new Class(this.player ?? this.character, this);
    }

    currentCFrame() {
        return this.character.HumanoidRootPart.CFrame;
    }

    playAnimation(animation: string, speed: number = 1, isCore?: boolean, freeze?: number) {
        let animtrack = track(animation, this.character)!;
        if (isCore) {
            if (this.coreAnimation) {
                this.coreAnimation.Stop();
            }
            this.coreAnimation = animtrack;
            animtrack.Priority = Enum.AnimationPriority.Core;
        }
        if (freeze) {
            task.delay(freeze, () => {
                animtrack.AdjustSpeed(0);
                // animtrack.TimePosition = animtrack.Length;
            });
        }
        animtrack.Play(0.1, 1, speed);
        return animtrack;
    }
}
