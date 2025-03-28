import {allEntities} from "shared/combat/entity/allEntities";
import {allRemotes, ClientCombat} from "./remotes";

allEntities.setArray([allRemotes.Client.Get("getLocalEntity").CallServer()]);
ClientCombat().Get("GuardBreak").Connect((Entity) => {
    print(Entity);
    // Entity.combat.isBlocking = false
    Entity.combat.GuardBreak();
});