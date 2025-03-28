import {allEntities} from "shared/combat/entity/allEntities";
import {allRemotes} from "shared/network/remotes";

const CombatNamespace = allRemotes.Server.GetNamespace("Combat");

CombatNamespace.Get("executeBlock").Connect(allEntities.withEntity((Ent, State) => {
    print(State);
    Ent.combat.isBlocking = State === "down";
}));
