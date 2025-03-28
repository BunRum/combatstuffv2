// type EntityType = Entity

// import { Workspace } from "@rbxts/services";
// workspace
// type EntityReturn = () => Entity
type inputTypes = Enum.KeyCode | Enum.UserInputType
type inputState = "up" | "down"
type AllAnimations = KeysExtend<typeof import("@rbxts/services").Workspace.AnimDummy.AnimSaves, KeyframeSequence>

type ICombatClass = import("shared/combat/entity/combatClass").combatClassBase
type IEntity = import("shared/combat/entity/index").EntityClass
