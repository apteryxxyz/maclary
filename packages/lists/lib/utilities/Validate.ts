import { Utilities } from './Utilities';
import { RangeError, TypeError } from '~/errors/ListsError';
import type { List } from '~/structures/List';
import type { Poster } from '~/structures/Poster';

export class Validate extends null {
    /**
     * Validate that a value is a valid positive integer.
     * @param name The name.
     * @param value The value to validate.
     */
    public static integer(name: string, value: unknown) {
        const integer = Number.parseInt(String(value), 10);
        if (Number.isNaN(integer)) throw new TypeError('InvalidType', name, 'number');
        if (integer < 0) throw new RangeError('MustBePositive', name, integer);
        return integer;
    }

    /**
     * Validate that a value is a function.
     * @param name The name.
     * @param value The value to validate.
     */
    public static function(name: string, value: unknown) {
        if (typeof value !== 'function') throw new TypeError('InvalidType', name, 'function');
        return value as (...args: unknown[]) => unknown;
    }

    /**
     * Validate that a value is valid poster options.
     * @param options The value to validate.
     */
    public static posterOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'options', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            guildCount: this.function('guildCount', typedOptions['guildCount']),
            userCount: this.function('userCount', typedOptions['userCount']),
            shardCount: this.function('shardCount', typedOptions['shardCount']),
            voiceConnectionCount: this.function(
                'voiceConnectionCount',
                typedOptions['voiceConnectionCount']
            ),
        }) as Poster.Options;
    }

    /**
     * Validate that the value is valid statistics options.
     * @param options The value to validate.
     */
    public static statisticsOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'options', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            guildCount: this.integer('guildCount', typedOptions['guildCount']),
            userCount: this.integer('userCount', typedOptions['userCount']),
            shardCount: this.integer('shardCount', typedOptions['shardCount']),
            voiceConnectionCount: this.integer(
                'voiceConnectionCount',
                typedOptions['voiceConnectionCount']
            ),
        }) as List.StatisticsOptions;
    }
}
