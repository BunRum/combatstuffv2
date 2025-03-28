import {RunService, UserInputService} from "@rbxts/services";

export type inputTypes = Enum.KeyCode | Enum.UserInputType;
export type inputState = "up" | "down";

export const bindedInputs = new Map<inputTypes, (state: inputState) => void>();

export function bindAction(func: (state: inputState) => void, ...inputTypes: Array<inputTypes>) {
    // print("bind action")

    // print(inputTypes)

    inputTypes.forEach((inputType) => bindedInputs.set(inputType, (state: inputState) => func(state)));
}

export function unbindAction(...inputTypes: Array<inputTypes>) {
    inputTypes.forEach(inputType => bindedInputs.delete(inputType));
}

const InputTypesDown = new Map<inputTypes, boolean>();

RunService.Heartbeat.Connect(() => {
    bindedInputs.forEach((InputFunc, input) => {
        if (InputTypesDown.has(input) && InputTypesDown.get(input) === true) {
            InputFunc("down");
        }
    });
});

UserInputService.InputBegan.Connect((input) => {
    InputTypesDown.set(input.UserInputType, true);
    InputTypesDown.set(input.KeyCode, true);
});
UserInputService.InputEnded.Connect((input) => {
    InputTypesDown.set(input.UserInputType, false);
    InputTypesDown.set(input.KeyCode, false);

    const InputFunc = bindedInputs.get(input.UserInputType) ?? bindedInputs.get(input.KeyCode);
    // InputFunc()
    if (InputFunc) {
        InputFunc("up");
    }
});

export function Bind(param: inputTypes) {
    return function (
        target: ICombatClass,
        propertyKey?: string,
        descriptor?: TypedPropertyDescriptor<(args: any) => void>,
    ) {
        const originalMethod = descriptor!.value;
        print("first run");

        const replacementMethod = function (this: any, ...args: Array<unknown>) {
            const e = this as ICombatClass;
            print("ran, ran", e.character);
            return originalMethod(this, args);
        };

        if (!RunService.IsServer()) {
            print("fancy bind");
            bindAction(() => replacementMethod(target), param);
            // }
        }

        descriptor!.value = replacementMethod;
        return descriptor;
    };
}

const onceMap = new Map<string, boolean>();

export function inputOnce(onState?: inputState) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Callback>) {
        const originalMethod = descriptor.value;
        // let um = false
        print("input once", target, propertyKey, descriptor)
        descriptor.value = function (this: any, ...args: Array<unknown>) {
            const onceState = onceMap.get(propertyKey ?? false);
            const state = args[0] as inputState;
            const onceStateCondition = state === "down";
            // print("notonce", target, propertyKey, args)
            if (onceState !== onceStateCondition) {
                print("once", target, propertyKey, state);
                onceMap.set(propertyKey, onceStateCondition);
                if (state === (onState ?? state)) originalMethod(this, state);
            }
        };
        return descriptor;
    };
}
