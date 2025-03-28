import {Players, RunService, UserInputService, Workspace} from "@rbxts/services";

const UserGameSettings = UserSettings().GetService("UserGameSettings");
const character = (Players.LocalPlayer.Character || Players.LocalPlayer.CharacterAdded.Wait()[0]) as Character;
Workspace.CurrentCamera!.CameraType = Enum.CameraType.Scriptable;
Workspace.CurrentCamera!.CameraSubject = undefined;

const cam = Workspace.CurrentCamera!;
cam.CFrame = character.Head.CFrame.ToWorldSpace(new CFrame(0, 2, 10));

function capNumber(num: number, min: number, max: number): number {
    return math.max(min, math.min(num, max));
}

let zoom = 10;
let delta = new Vector2(0, 0);
let mouselock = false;
// let zoomlock = false;
const lasttransparencies: BasePart[] = [];

UserInputService.InputChanged.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseWheel) {
        // print("whoo", input.Position)
        zoom = capNumber(zoom += -input.Position.Z, 0, 20);
        print(zoom);

        if (zoom === 0) {
            // mouselock = true;
            // zoomlock = true;
            character
                .GetChildren()
                .filter((child): child is AccessoryExtended => child.IsA("Accessory"))
                .filter(
                    (accessory) =>
                        accessory.AccessoryType === Enum.AccessoryType.Hair
                        || accessory.AccessoryType === Enum.AccessoryType.Face
                        || accessory.AccessoryType === Enum.AccessoryType.Hat,
                )
                .forEach((Accessory) => {
                    lasttransparencies.push(Accessory.Handle);
                    Accessory.Handle.Transparency = 1;
                });
            character.Head.Transparency = 1;
            lasttransparencies.push(character.Head);
        } else {
            if (lasttransparencies.size() > 0) {
                // mouselock = false;
                // zoomlock = false;
                // UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
                // UserGameSettings.RotationType = Enum.RotationType.MovementRelative;
                lasttransparencies.forEach((basepart) => {
                    lasttransparencies.remove(lasttransparencies.findIndex((bp) => bp === basepart));
                    basepart.Transparency = 0;
                });
            }
        }
    }
});

UserInputService.InputBegan.Connect((io) => {
    if (io.KeyCode === Enum.KeyCode.LeftControl) {
        mouselock = !mouselock;
    }
});

let totaldeltax = 0;
let totaldeltay = 0;

function updateMouseBehavior() {
    if (!mouselock) {
        UserInputService.MouseBehavior = UserInputService.IsMouseButtonPressed("MouseButton2")
            ? Enum.MouseBehavior.LockCurrentPosition
            : Enum.MouseBehavior.Default;
        UserGameSettings.RotationType = Enum.RotationType.MovementRelative;
    } else {
        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
        UserGameSettings.RotationType = Enum.RotationType.CameraRelative;
    }
    if (zoom === 0) {
        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
        UserGameSettings.RotationType = Enum.RotationType.CameraRelative;
    }
}

const camp = new Instance("Part");
camp.Anchored = true;
camp.CanTouch = false;
camp.CanCollide = false;
camp.Parent = game.Workspace;

const focus = character.Head;
const offset = new Vector3(0, 0, 0)

RunService.Heartbeat.Connect(() => {
    delta = UserInputService.GetMouseDelta();
    // print(delta)

    totaldeltax += delta.X * 0.01 * 0.5;
    totaldeltay = math.clamp(totaldeltay + (delta.Y * 0.01 * 0.5), -1.425, 1.425);
    const dt = task.wait();
    updateMouseBehavior();

    let x = 0;
    let z = 0;
    let y = 0;
    if (zoom !== 0) {
        x = focus.Position.X + zoom * math.cos(totaldeltax) * math.cos(totaldeltay);
        z = focus.Position.Z + zoom * math.sin(totaldeltax) * math.cos(totaldeltay);
        y = focus.Position.Y + zoom * math.sin(totaldeltay);
    } else {
        x = focus.Position.X + -10 * math.cos(totaldeltax) * math.cos(totaldeltay);
        z = focus.Position.Z + -10 * math.sin(totaldeltax) * math.cos(totaldeltay);
        y = focus.Position.Y + 10 * -math.sin(totaldeltay);
    }
    const pos = new Vector3(x, y, z);
    const look = focus.Position;

    const targetCFrame = (zoom !== 0 ? new CFrame(pos, look) : new CFrame(look, pos)).mul(new CFrame(offset));
    cam.CFrame = zoom !== 0 ? cam.CFrame.Lerp(targetCFrame, dt * 10) : targetCFrame;
});
