import {Make} from "@rbxts/altmake";
import {KeyframeSequenceProvider, Workspace} from "@rbxts/services";
import {getLocalCharacter} from "./Utilities/misc";

export let loadedAnimations = new Map<string, Animation>();
export let animationInfo = new Map<Animation, string>();

export function track(animation: string, Character: Character = getLocalCharacter()) {
    const animslocation = Workspace.AnimDummy.AnimSaves;

    if (!loadedAnimations.has(animation)) {
        const kf = KeyframeSequenceProvider.RegisterKeyframeSequence(
            animslocation.FindFirstChild(animation) as KeyframeSequence,
        );
        loadedAnimations.set(animation, Make("Animation", {AnimationId: kf}));
    }

    const animationInsance = loadedAnimations.get(animation);

    const animator = Character.Humanoid.FindFirstChildOfClass("Animator");

    const track = animator?.LoadAnimation(animationInsance!);

    do {
        wait();
    } while (track?.Length === 0);

    return track;
}
