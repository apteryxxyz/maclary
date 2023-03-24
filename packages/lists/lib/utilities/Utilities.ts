export class Utilities extends null {
    /**
     * Create a runtime readonly map.
     * @param entries Initial entries.
     */
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

    /**
     * Delete all undefined properties from an object.
     * @param object The object to delete properties from.
     */
    public static deleteUndefinedProperties<T extends Record<string, unknown>>(object: T): T {
        for (const key of Object.keys(object)) if (object[key] === undefined) delete object[key];
        return object;
    }
}
