import {Make} from "@rbxts/altmake";
import {KeyframeSequenceProvider, Workspace} from "@rbxts/services"

export const allPlayingAnimations: {
    animation: AnimationClass
    isCore?: boolean
    slot?: string | number
}[] = []

export let loadedAnimations = new Map<string, Animation>();
// const AllAnimations = Workspace.
// globalThis.a
export class AnimationClass {
    length: number
    speed: number = 1
    private Character: Character
    private animation: AnimationTrack
    private name: string
    private freeze!: number

    constructor(name: AllAnimations | string, Character: Character) {
        this.Character = Character

        if (!loadedAnimations.has(name)) {
            const kf = KeyframeSequenceProvider.RegisterKeyframeSequence(
                Workspace.AnimDummy.AnimSaves.FindFirstChild(name) as KeyframeSequence,
            );
            loadedAnimations.set(name, Make("Animation", {AnimationId: kf}));
        }

        const animationInstance = loadedAnimations.get(name)!;

        const animator = Character.Humanoid.FindFirstChildOfClass("Animator")!;

        this.animation = animator.LoadAnimation(animationInstance);

        do {
            wait();
        } while (this.animation.Length === 0);

        this.length = this.animation.Length
        // this.animation.Ended.
        this.name = name
    }

    setPriority(Priority: Enum.AnimationPriority) {
        this.animation.Priority = Priority
        return this
    }

    Play(slot?: string | number) {
        if (slot) {
            allPlayingAnimations.find((anim) => anim.slot === slot)?.animation.Stop()
        }
        this.animation.Play(0.1, 1, this.speed)
        allPlayingAnimations.push({
            animation: this,
            slot: slot
            // isCore:
        })
        if (this.freeze) {
            task.delay(this.freeze, () => {
                if (!this.animation.IsPlaying) return
                this.animation.AdjustSpeed(0)
            })
        }
        this.animation.Ended.Once(() => {
            // print(this.name)
            const f = allPlayingAnimations.findIndex((anim) => anim.animation === this)
            // print(f)
            // if (f) {
            allPlayingAnimations.remove(f)
            // }
        })
        return this
    }

    Stop() {
        this.animation.Stop()
    }

    changeLength(desiredLength: number) {
        const animSpeed = this.animation.Length / desiredLength
        this.animation.AdjustSpeed(animSpeed)
        this.length = desiredLength
        return this
    }

    changeSpeed(speed: number) {
        this.animation.AdjustSpeed(speed)
        this.speed = speed
        this.length = this.animation.Length / this.speed
        return this
    }

    freezeAt(freeze: number) {
        this.freeze = freeze
        return this
    }
}