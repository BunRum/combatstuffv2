import Object from "@rbxts/object-utils";
import {RunService, TweenService, Workspace} from "@rbxts/services";
import {track} from "shared/animationPlayer";
import {bindAction} from "shared/inputModule";
import {EnhancedArray, getLocalCharacter, overlapParamBuilder} from "shared/Utilities/misc";

let animationFinished: boolean = true;
let tointeractiontime = 0.15;
let desiredlength = 0.76;

const Character = getLocalCharacter();

function checkInteraction(Character: Character = getLocalCharacter()) {
    const pp = new EnhancedArray(Character.GetChildren().filter(i => i.IsA("BasePart"))).flatMap(bp =>
        Workspace.GetPartsInPart(bp, overlapParamBuilder(Character))
    );
    const uniquebp = Object.keys(new Set(pp));
    const m = uniquebp.filter(p => p.GetTags().size() !== 0)[0];
    if (m) {
        return {type: m.GetTags()[0], obj: m};
    }
}

RunService.PostSimulation.Connect(() => {
    if (checkInteraction()) {
        Character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
    } else {
        Character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, true);
    }
});
print("got here");
bindAction(() => {
    if (animationFinished) {
        print("asdsad");
        const interactionObject = checkInteraction();
        if (interactionObject) {
            if (interactionObject.type === "Vault" && Character.Humanoid.GetState() !== Enum.HumanoidStateType.Freefall) {
                const vaultObject = interactionObject.obj;
                print(vaultObject.Position.Y);
                if (vaultObject.Position.Y !== math.ceil(Character.HumanoidRootPart.CFrame.Position.Y)) {
                    return;
                }

                animationFinished = false;
                let VaultAnimation = track("alt1")!;
                const animspeed = VaultAnimation.Length / desiredlength;
                const length = VaultAnimation.Length / animspeed;
                VaultAnimation.Play(0.1);
                VaultAnimation.AdjustSpeed(animspeed);

                const colliding = Character.GetChildren().filter((child): child is BasePart =>
                    child.IsA("BasePart") && child.CanCollide === true
                );
                colliding.forEach(part => part.CanCollide = false);
                Character.HumanoidRootPart.Anchored = true;

                const p = new Vector3(vaultObject.Position.X, Character.HumanoidRootPart.Position.Y, vaultObject.Position.Z);
                const a = vaultObject.CFrame;

                // to vault pos
                TweenService.Create(Character.HumanoidRootPart, new TweenInfo(tointeractiontime, Enum.EasingStyle.Linear), {
                    CFrame: new CFrame(p, p.add(a.LookVector.mul(100))),
                }).Play();

                VaultAnimation.GetMarkerReachedSignal("start").Once(() => {
                    VaultAnimation.AdjustSpeed(0);
                    print("reached");
                });
                VaultAnimation.GetMarkerReachedSignal("fade").Once(() => {
                    colliding.forEach(part => part.CanCollide = true);
                    Character.HumanoidRootPart.Anchored = false;
                    VaultAnimation.Stop(0.25);
                    task.delay(0.25, () => {
                        animationFinished = true;
                    });
                });

                task.delay(tointeractiontime, () => {
                    VaultAnimation.AdjustSpeed(animspeed);
                    Character.HumanoidRootPart.CFrame = CFrame.lookAt(
                        Character.HumanoidRootPart.Position,
                        p.add(a.LookVector.mul(100)),
                    );
                    let tt = TweenService.Create(Character.HumanoidRootPart, new TweenInfo(length, Enum.EasingStyle.Linear), {
                        CFrame: Character.HumanoidRootPart.CFrame.add(vaultObject.CFrame.LookVector.mul(5)),
                    });
                    tt.Play();
                    task.delay(length - 0.08, () => {
                        tt.Cancel();
                    });
                });
            }
        }
    }
}, Enum.KeyCode.Space);
