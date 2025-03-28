import {RunService} from "@rbxts/services";
import {t} from "@rbxts/t";
import {bindAction, inputOnce, inputState, inputTypes, unbindAction} from "shared/inputModule";
import {allRemotes, remotes} from "shared/network/remotes";
import {getLocalCharacter, getLocalPlayer, overlapParamBuilder} from "shared/Utilities/misc";
import {applyvelocity} from "../physics/velocity";
import {AnimationClass} from "shared/animationClass";
import {allEntities} from "./allEntities";

const ClientCombatNameSpace = () => allRemotes.Client.GetNamespace("Combat");

export class combatClassBase {
    player?: Player;
    character!: Character;
    humanoid: Humanoid;
    name!: string;

    CurrentCombo = 0;
    MaxCombo = 5;
    Health = 10000;
    speedModifier = 1;
    DamageNegation = 0.1;
    isBlocking = false;
    isSprinting = false;
    defaultOverlapParams: OverlapParams;
    timers: Map<string, number> = new Map();
    blockingAnimation!: AnimationClass;
    lastBlockState!: inputState
    Keybinds = new Map<inputTypes, (state: inputState) => void>([
        [Enum.KeyCode.F, this.executeBlock],
        [Enum.UserInputType.MouseButton1, this.executeAttack],
        [Enum.KeyCode.LeftShift, this.Sprint],
        [Enum.KeyCode.Q, this.Dash],
    ]);
    protected _entity!: () => IEntity; // technically not circular :3

    protected constructor(playerOrCharacter: Player | Character = getLocalPlayer(), e: IEntity) {
        const isPlayer = t.instanceIsA("Player")(playerOrCharacter);
        const isCharacter = (t.instanceIsA("Model") as t.check<Character>)(playerOrCharacter);
        if (isPlayer) {
            this.player = playerOrCharacter;
            this.character = this.player.Character as Character;
        } else if (isCharacter) {
            this.character = playerOrCharacter;
        }
        this.humanoid = this.character.Humanoid;
        this.defaultOverlapParams = overlapParamBuilder(this.character);
        this.bindInputs();
        this.humanoid.MaxHealth = this.Health
        this.humanoid.Health = this.Health

        this._entity = () => e
    }

    private _Stunned: boolean = false;

    get Stunned() {
        return this._Stunned
    }

    set Stunned(v: boolean) {
        const last = this._Stunned
        this._Stunned = v
        if (!last && this.Stunned) {
            this.character.HumanoidRootPart.Anchored = true
            this.humanoid.AutoRotate = false
        } else if (last && !this.Stunned) {
            this.character.HumanoidRootPart.Anchored = false
            this.humanoid.AutoRotate = true
        }
    }

    get Entity() {
        return this._entity() ?? allEntities.get(this.character)!
    }

    bindInputs() {
        if (this.isLocalPlayer()) {
            this.Keybinds.forEach((func, inputTypes) => {
                bindAction(func, inputTypes);
            });
        }
    }

    Bind(input: inputTypes, func: (state: inputState) => void) {
        const middle = (state: inputState) => {
            if (this.isBlocking || this.Stunned) return
            func(state)
        } // n()
        this.Keybinds.set(input, middle);
        print("possessed")
        print("soa")
        this.bindInputs();
    }

    UnbindAll() {
        if (this.isLocalPlayer()) {
            this.Keybinds.forEach((_, input) => {
                unbindAction(input);
            });
        }
    }

    getTimeSinceTimer(timerName: string): number {
        return (os.clock() - (this.timers.get(timerName) ?? 0)) * this.speedModifier;
    }

    resetTimer(timerName: string): void {
        this.timers.set(timerName, os.clock());
    }

    incrementCombo(): void {
        this.CurrentCombo++;
        this.CurrentCombo = this.CurrentCombo > this.MaxCombo ? 1 : this.CurrentCombo;
    }

    isLocalPlayer() {
        return !RunService.IsServer() ? this.player === getLocalPlayer() : false;
    }

    // @Bind(Enum.UserInputType.MouseButton1)
    executeAttack() {
        if (this.isBlocking || this.Stunned) return;
        if (!this.Stunned) {
            const result = this.Attack();
            if (result) {

                this.humanoid.WalkSpeed = 6;
                task.delay(0.3, () => {
                    this.humanoid.WalkSpeed = 16;
                });

            }
            return result;
        }
    }

    @inputOnce()
    executeBlock(state: inputState, send: boolean = true) {
        if (this.Stunned || (state === "up" && this.lastBlockState === state)) return;
        this.lastBlockState = state
        print("execute state manager")

        this.isBlocking = state === "down";
        this.humanoid.WalkSpeed = this.isBlocking ? 6 : 16;
        if (this.isBlocking) {
            this.blockingAnimation = new AnimationClass("Block", this.character).freezeAt(0.18).setPriority(Enum.AnimationPriority.Action).Play("block")
        } else {
            this.blockingAnimation?.Stop();
        }
        if (this.isLocalPlayer() && send) ClientCombatNameSpace().Get("executeBlock").SendToServer(state);

        this.Block(state);
    }

    @inputOnce("down")
    Dash() {
        if (this.isBlocking || this.Stunned) return;
        applyvelocity(this.character, new Vector3(0, 0, -10), 0.3);
    }

    TakeDamage(dmg: number) {
        if (this.isBlocking) {
            dmg *= this.DamageNegation;
            print(this.character, "is blocking do 0.5x damage");
        }
        print(`${this.character} take ${dmg} Damage`);
        if (!RunService.IsServer()) {
            if (this.character !== getLocalCharacter()) {
            }
        } else {
            this.humanoid.TakeDamage(dmg);
        }
    }

    GuardBreak() {
        // this.stun
        if (!this.Stunned && this.isBlocking) {
            if (this.isLocalPlayer()) {
                this.executeBlock("up", false)
            } else {
                this.isBlocking = false
            }
            new AnimationClass("GuardBreak", this.character).setPriority(Enum.AnimationPriority.Action2).Play()
            this.Stunned = true;
            task.delay(1.8, () => {
                this.Stunned = false;
            });
        }
        if (RunService.IsServer()) {
            // remotes.Server
            remotes.Combat.Server.Get("GuardBreak").SendToAllPlayers(this.Entity)
            // ServerCombat().Get("GuardBreak").SendToAllPlayers(this.Entity);
        }
    }

    Sprint(state: inputState) {
        if (this.isBlocking || this.Stunned) return;
        this.humanoid.WalkSpeed = state === "down" ? 24 : 16;
    }

    Attack(): Set<IEntity> | undefined {
        return 1 as unknown as Set<IEntity> | undefined;
    }

    Block(_state: inputState) {
    }
}
