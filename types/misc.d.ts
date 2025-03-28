type KeysExtend<T, U> = {
    [K in keyof T]: T[K] extends U ? (K extends string ? K : never) : never;
}[keyof T];

type AllKeyCodes = keyof typeof Enum.KeyCode
type AllUserInputTypes = keyof typeof Enum.UserInputType

interface Function {
    __tostring: () => string
}