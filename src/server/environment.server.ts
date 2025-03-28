import {CollectionService, PhysicsService, RunService} from "@rbxts/services";
import {EntityClass} from "shared/combat/entity";
import {allEntities} from "shared/combat/entity/allEntities";

const AllDummies = CollectionService.GetTagged("Dummy").map((d) => new EntityClass(d as Character, "base"));
AllDummies.forEach(dummy => allEntities.push(dummy));

RunService.Stepped.Connect(() => {
    AllDummies.forEach((Dummy) => {
        const result = Dummy.combat?.executeAttack();
        if (Dummy.character.HasTag("GuardBreak")) {
            result?.forEach((hitEntity) => {
                // print("break guard", hitEntity.character);
                hitEntity.combat.GuardBreak();
            });
        }

        // if (Dummy.`1`)

    });
});

PhysicsService.RegisterCollisionGroup("char")
PhysicsService.RegisterCollisionGroup("arm")

PhysicsService.CollisionGroupSetCollidable("char", "arm", false)


// Workspace.