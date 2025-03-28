import {Players} from "@rbxts/services";
import {EntityClass} from "shared/combat/entity";
import {allEntities} from "shared/combat/entity/allEntities";
import {allRemotes, ServerCombat} from "shared/network/remotes";


Players.PlayerAdded.Connect((player) => {
    print("player added");
    const playerEntity = new EntityClass(player, "base");
    allEntities.push(playerEntity);
});

ServerCombat().Get("getAllEntities").SetCallback(() => {
    print("called", allEntities.getArray());
    return allEntities.getArray();
});

allRemotes.Server.Get("getLocalEntity").SetCallback((player) => {
    return allEntities.get(player)!;
});

