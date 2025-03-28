import Gizmo from "@rbxts/better-gizmos";
import {RunService, Workspace} from "@rbxts/services";
import {EnhancedArray, getLocalCharacter} from "shared/Utilities/misc";

class entitiesArray extends EnhancedArray<IEntity> {
    giz = Gizmo.box.default();

    constructor(arr?: IEntity[]) {
        if (!RunService.IsServer()) {
            super(arr);
        } else {
            super();
        }
    }

    get(key: Character | Player): IEntity | undefined {
        return super.find((v) => v.character === key || v.player === key);
    }

    getLocalEntity() {
        return this.get(getLocalCharacter())!;
    }

    getEntitiesInBox(cframe: CFrame, size: Vector3, OverlapParams: OverlapParams) {
        const g = Gizmo.box.assign(this.giz, cframe, size);
        g.AlwaysOnTop = false;
        g.Transparency = 0.8;
        g.Color3 = Color3.fromRGB(99, 46, 46);

        return new Set(
            Workspace.GetPartBoundsInBox(cframe, size, OverlapParams)
                .map(part => part.FindFirstAncestorOfClass("Model")!)
                .filter(model => model?.FindFirstChildWhichIsA("Humanoid") !== undefined).map(
                Char => this.get(Char as Character)!,
            ),
        );
    }

    withEntity<T extends IEntity, Args extends unknown[]>(mn: (EntityObject: T, ...args: Args) => void) {
        return (playerOrCharacter: Player | Character, ...args: Args) => {
            let EntityObject = allEntities.get(playerOrCharacter) as T;
            mn(EntityObject, ...args);
        };
    }

    wait(): Promise<undefined> {
        return new Promise((resolve) => {
            RunService.Heartbeat.Connect(() => {
                if (this.size() > 0) resolve(undefined);
            });
        });
        // Promise.
    }
}

export const allEntities = new entitiesArray();
print(allEntities.getArray());
