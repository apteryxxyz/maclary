export class Utilities extends null {
    public static makeReadonlyMap<K, V>(entries: [K, V][]): ReadonlyMap<K, V> {
        const map = new Map(entries);

        return Object.freeze({
            entries: map.entries.bind(map),
            forEach: map.forEach.bind(map),
            get: map.get.bind(map),
            has: map.has.bind(map),
            keys: map.keys.bind(map),
            size: map.size,
            values: map.values.bind(map),
            [Symbol.iterator]: map[Symbol.iterator].bind(map),
        });
    }

    public static deleteUndefinedProperties<T extends Record<string, unknown>>(obj: T): T {
        for (const key of Object.keys(obj)) if (obj[key] === undefined) delete obj[key];
        return obj;
    }
}
