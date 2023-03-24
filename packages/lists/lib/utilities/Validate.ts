import { Utilities } from './Utilities';
import { RangeError, TypeError } from '~/errors/BotListsError';
import type { List } from '~/structures/List';
import type { Poster } from '~/structures/Poster';

export class Validate extends null {
    /**
     * Validate that a value is a valid positive integer.
     * @param value The value to validate.
     */
    public static integer(value: unknown) {
        const integer = Number.parseInt(String(value), 10);
        if (Number.isNaN(integer)) throw new TypeError('InvalidType', 'number');
        if (integer < 0) throw new RangeError('MustBePositive', integer);
        return integer;
    }

    /**
     * Validate that a value is a function.
     * @param value The value to validate.
     */
    public static function(value: unknown) {
        if (typeof value !== 'function') throw new TypeError('InvalidType', 'function');
        return value as (...args: unknown[]) => unknown;
    }

    /**
     * Validate that a value is valid poster options.
     * @param options The value to validate.
     */
    public static posterOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            guildCount: this.function(typedOptions['guildCount']),
            userCount: this.function(typedOptions['userCount']),
            shardCount: this.function(typedOptions['shardCount']),
            voiceConnectionCount: this.function(typedOptions['voiceConnectionCount']),
        }) as Poster.Options;
    }

    /**
     * Validate that the value is valid statistics options.
     * @param options The value to validate.
     */
    public static statisticsOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            guildCount: this.integer(typedOptions['guildCount']),
            userCount: this.integer(typedOptions['userCount']),
            shardCount: this.integer(typedOptions['shardCount']),
            voiceConnectionCount: this.integer(typedOptions['voiceConnectionCount']),
        }) as List.StatisticsOptions;
    }
}
