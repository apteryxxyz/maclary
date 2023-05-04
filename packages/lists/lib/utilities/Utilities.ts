import type EventEmitter from 'node:events';

export class Utilities extends null {
    /**
     * Create a runtime readonly map.
     * @param entries Initial entries.
     */
    public static makeReadonlyMap<K, V>(entries: (readonly [K, V])[]): ReadonlyMap<K, V> {
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
    public static deleteUndefinedProperties<O extends Record<string, unknown>>(object: O) {
        for (const key of Object.keys(object)) if (object[key] === undefined) delete object[key];
        return object as {
            [K in keyof O]: O[K] extends undefined ? never : O[K];
        };
    }

    /**
     * Execute a promise, emitting events on success or failure.
     * @param promiseFunc Function that returns a promise.
     * @param emitter The event emitter to emit the events on.
     * @param successEvent Event to emit when the promise resolves.
     * @param failureEvent Event to emit when the promise rejects.
     * @param importantArgs Arguments to pass to the event listener.
     */
    public static async executePromiseWithEvents(
        promiseFunc: () => Promise<unknown>,
        emitter: EventEmitter,
        successEvent: string,
        failureEvent: string,
        importantArgs: unknown[] = []
    ) {
        try {
            await promiseFunc();
            emitter.emit(successEvent, ...importantArgs);
        } catch (error) {
            emitter.emit(failureEvent, ...importantArgs, error);
            throw error;
        }
    }
}
