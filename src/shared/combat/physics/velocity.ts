import {Make} from "@rbxts/altmake";
import {t} from "@rbxts/t";

export function applyvelocity(
    p: BasePart | Model,
    targetDisplacement: Vector3 = new Vector3(1, 1, 1),
    timeToReach: number,
) {
    if (t.instanceIsA("Model")(p)) {
        p = p.PrimaryPart!;
    }
    const worldDisplacement = p.CFrame.VectorToWorldSpace(targetDisplacement);
    const worldVelocity = worldDisplacement.div(timeToReach);
    const bv = Make("BodyVelocity", {Velocity: worldVelocity, MaxForce: Vector3.one.mul(math.huge), Parent: p});
    task.delay(timeToReach, () => {
        bv.Destroy();
    });
}
