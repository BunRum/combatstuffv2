import {Players, Workspace} from "@rbxts/services";

export function getLocalCharacter(): Character {
    return (Players.LocalPlayer.Character ?? Players.LocalPlayer.CharacterAdded.Wait()[0]) as Character;
}

export function getLocalPlayer(): Player {
    return Players.LocalPlayer;
}

export type AllAnimations = KeysExtend<typeof Workspace.AnimDummy.AnimSaves, KeyframeSequence>;

export class EnhancedArray<V extends defined> {
    private array: V[];

    constructor(predefinedArray?: V[]) {
        // this.array = new Array()
        this.array = predefinedArray ?? new Array<V>();
    }

    // Custom method to get the first element
    first(): V | undefined {
        return this.array[0];
    }

    // Custom method to get the last element
    last(): V | undefined {
        // this.array.size()
        return this.array[this.array.size() - 1];
    }

    // Custom method to check if the array is empty
    isEmpty(): boolean {
        return this.array.size() === 0;
    }

    // Custom method to push an element into the array
    push(...item: V[]) {
        // item.forEach((item => {
        //     this.array.push(item)
        // })
        item.forEach((item) => {
            this.array.push(item);
        });
        // this.array.push()
    }

    find(predicate: (value: V, index: number, obj: readonly V[]) => boolean): V | undefined {
        return this.array.find(predicate);
    }

    // Custom method to remove an element from the array
    remove(index: number) {
        this.array.remove(index);
        // return this.array.splice(index, 1)[0];
    }

    // Custom method to insert an element at a specific index
    insert(index: number, value: V): void {
        // this.array.
        this.array.insert(index, value);
        // this.array.splice(index, 0, value);
    }

    // Custom method to clear the array
    clear(): void {
        this.array.clear();
        // this.array.size() = 0;
    }

    // Access the raw array if needed
    getArray(): Array<V> {
        return this.array;
    }

    setArray(arr: Array<V>) {
        this.array = arr;
    }

    // Getter for array size
    size(): number {
        return this.array.size();
    }

    // Example of overriding the 'join' method
    join(separator?: string): string {
        return this.array.join(separator);
    }

    // Custom method for map functionality
    map<U>(callback: (value: V, index: number, array: readonly V[]) => U): U[] {
        return this.array.map(callback);
    }

    // Custom method for filter functionality
    filter(callback: (value: V, index: number, array: readonly V[]) => boolean): Array<V> {
        return this.array.filter(callback);
    }

    flatMap<U>(fn: (item: V) => U[]): U[] {
        let result: U[] = [];
        // Apply the function to each element and concatenate the result
        this.array.forEach((item) => {
            const mapped = fn(item); // Get the mapped array
            result = [...result, ...mapped]; // Use the custom concat function to flatten
        });

        return result; // Return the flattened array
    }
}

// i
export function isArray<T>(v: unknown): v is T[] {
    return (v as T[]).size() > 0;
}

export class EnhancedMap<K, V> {
    map: Map<K, V>;

    constructor(predefinedMap?: Map<K, V>) {
        this.map = predefinedMap ?? new Map<K, V>();
    }

    // Custom set method
    set(key: K, value: V): this {
        this.map.set(key, value);
        return this; // Return 'this' for chaining
    }

    // Custom delete method
    delete(key: K): boolean {
        return this.map.delete(key);
    }

    // Custom clear method
    clear(): void {
        this.map.clear();
    }

    // Check if map is empty
    isEmpty(): boolean {
        return this.map.size() === 0;
    }

    // Custom forEach method
    forEach(callbackfn: (value: V, key: K, self: Map<K, V>) => void): void {
        this.map.forEach(callbackfn);
    }

    // Get the size of the map
    size(): number {
        return this.map.size();
    }

    // Check if map contains a key
    has(key: K): boolean {
        return this.map.has(key);
    }

    // Custom get method
    get(key: K): V | undefined {
        return this.map.get(key);
    }
}

export function overlapParamBuilder(filteredInstance?: Instance, filterType?: Enum.RaycastFilterType): OverlapParams {
    const p = new OverlapParams();
    if (filteredInstance) {
        p.AddToFilter(filteredInstance);
        p.FilterType = filterType ?? Enum.RaycastFilterType.Exclude;
    }
    return p;
}
