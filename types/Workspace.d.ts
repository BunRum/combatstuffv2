interface Workspace extends Model {
    killbrick: Part & {
        kill: Script;
    };
    Camera: Camera;
    Baseplate: Part & {
        Texture: Texture;
    };
    heart: MeshPart;
    Part: Part;
    AnimDummy: Model & {
        ["shards white"]: Accessory & {
            Handle: Part & {
                BodyBackAttachment: Attachment & {
                    OriginalPosition: Vector3Value;
                };
                AccessoryWeld: Weld;
                OriginalSize: Vector3Value;
                SpecialMesh: SpecialMesh;
                AvatarPartScaleType: StringValue;
            };
        };
        Humanoid: Humanoid & {
            Animator: Animator;
            HumanoidDescription: HumanoidDescription;
        };
        ["Accessory (Meshes/giselleAccessory)"]: Accessory & {
            Handle: Part & {
                OriginalSize: Vector3Value;
                AccessoryWeld: Weld;
                FaceCenterAttachment: Attachment & {
                    OriginalPosition: Vector3Value;
                };
                SpecialMesh: SpecialMesh;
                AvatarPartScaleType: StringValue;
            };
        };
        ["Accessory (Beanie_ambrosia)"]: Accessory & {
            Handle: Part & {
                HatAttachment: Attachment & {
                    OriginalPosition: Vector3Value;
                };
                OriginalSize: Vector3Value;
                AccessoryWeld: Weld;
                Mesh: SpecialMesh;
                AvatarPartScaleType: StringValue;
            };
        };
        ["Body Colors"]: BodyColors;
        HumanoidRootPart: Part & {
            RootJoint: Motor6D;
            RootAttachment: Attachment;
        };
        CharacterMesh: CharacterMesh;
        Pants: Pants;
        ["Accessory (GiselleHairAccessory)"]: Accessory & {
            Handle: Part & {
                OriginalSize: Vector3Value;
                HairAttachment: Attachment & {
                    OriginalPosition: Vector3Value;
                };
                AccessoryWeld: Weld;
                SpecialMesh: SpecialMesh;
                AvatarPartScaleType: StringValue;
            };
        };
        Head: Part & {
            HatAttachment: Attachment;
            FaceFrontAttachment: Attachment;
            HairAttachment: Attachment;
            face: Decal;
            Mesh: SpecialMesh;
            FaceCenterAttachment: Attachment;
        };
        ["Accessory (defaultAccessory)"]: Accessory & {
            Handle: Part & {
                OriginalSize: Vector3Value;
                BodyFrontAttachment: Attachment & {
                    OriginalPosition: Vector3Value;
                };
                AccessoryWeld: Weld;
                SpecialMesh: SpecialMesh;
                AvatarPartScaleType: StringValue;
            };
        };
        AnimSaves: Folder & {
            Sprint: KeyframeSequence;
            test1: KeyframeSequence;
            newPunch1: KeyframeSequence;
            Attack1: KeyframeSequence;
            Attack4: KeyframeSequence;
            Attack2: KeyframeSequence;
            Attack3: KeyframeSequence;
            Idle: KeyframeSequence;
            Attack5: KeyframeSequence;
            newPunch4: KeyframeSequence;
            newPunch3: KeyframeSequence;
            newPunch5: KeyframeSequence;
            newPunch2: KeyframeSequence;
            Walk: KeyframeSequence;
        };
        ["Right Arm"]: Part & {
            RightShoulderAttachment: Attachment;
            RightGripAttachment: Attachment;
        };
        ["Left Arm"]: Part & {
            LeftGripAttachment: Attachment;
            LeftShoulderAttachment: Attachment;
        };
        ["Left Leg"]: Part & {
            LeftFootAttachment: Attachment;
        };
        ["Right Leg"]: Part & {
            RightFootAttachment: Attachment;
        };
        Shirt: Shirt;
        Torso: Part & {
            RightCollarAttachment: Attachment;
            WaistCenterAttachment: Attachment;
            BodyBackAttachment: Attachment;
            Neck: Motor6D;
            LeftCollarAttachment: Attachment;
            ["Left Hip"]: Motor6D;
            roblox: Decal;
            ["Right Hip"]: Motor6D;
            ["Left Shoulder"]: Motor6D;
            ["Right Shoulder"]: Motor6D;
            BodyFrontAttachment: Attachment;
            WaistBackAttachment: Attachment;
            WaistFrontAttachment: Attachment;
            NeckAttachment: Attachment;
        };
    };
    ["Lumina Particles"]: Folder;
    SpawnLocation: SpawnLocation & {
        Decal: Decal;
    };
}
