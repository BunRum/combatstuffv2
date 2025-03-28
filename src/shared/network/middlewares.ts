import {clientMiddleware} from "@rbxts/net/out/middleware";
import {allEntities} from "shared/combat/entity/allEntities";
import {isArray} from "shared/Utilities/misc";

function serializeEntity<T extends unknown | unknown[]>(v: T): T extends unknown[] ? IEntity[] : IEntity {
    if (isArray<IEntity>(v)) {
        return v.map((ent) =>
            allEntities.get(ent.character) ?? new (import("shared/combat/entity").expect().EntityClass)(ent)
        ) as T extends unknown[] ? IEntity[] : never;
    } else {
        return (allEntities.get((v as IEntity).character)
            ?? new (import("shared/combat/entity").expect().EntityClass)(v)) as T extends unknown[] ? never : IEntity;
    }
}

export const entityCallServer: clientMiddleware = (forward: () => IEntity) => {
    return () => {
        const result = forward();
        return serializeEntity(result);
    };
};

export const EntityCallClient: clientMiddleware<[Entity: IEntity]> = (
    forward: (Entity: IEntity) => void,
) => {
    return (...args) => {
        const ent = serializeEntity(args[0]);
        forward(ent);
    };
};
