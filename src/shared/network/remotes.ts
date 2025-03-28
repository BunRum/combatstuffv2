import Net, {Definitions} from "@rbxts/net";
import {EntityCallClient, entityCallServer} from "./middlewares";

export const allRemotes = Net.CreateDefinitions({
    Combat: Definitions.Namespace({
        executeBlock: Net.Definitions.ClientToServerEvent<[state: inputState]>(),
        getAllEntities: Definitions.ServerFunction<() => IEntity[]>([], [entityCallServer]),
        GuardBreak: Net.Definitions.ServerToClientEvent<[Ent: IEntity]>([EntityCallClient]),
    },),
    getLocalEntity: Definitions.ServerFunction<() => IEntity>([], [entityCallServer]),
    t: Definitions.ClientToServerEvent<[a: unknown]>([Net.Middleware.Logging()]),
});
// type ad = ExtractKeys<a>
// allRemotes.Client.GetNamespace("Combat").Get("")
export const remotes = new class {
    Combat = new class {
        get Server() {
            return allRemotes.Server.GetNamespace("Combat")
        }

        get Client() {
            return allRemotes.Client.GetNamespace("Combat")
        }
    }
    private _a!: number

    get Server() {
        return allRemotes.Server
    }

    get Client() {
        return allRemotes.Client
    }
}

export const ServerCombat = () => allRemotes.Server.GetNamespace("Combat");
export const ClientCombat = () => allRemotes.Client.GetNamespace("Combat");
