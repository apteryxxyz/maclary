import { Utilities } from './Utilities';
import { RangeError, TypeError } from '~/errors/ListsError';
import type { List } from '~/structures/List';
import type { Poster } from '~/structures/Poster';
import type { Webhook } from '~/structures/Webhook';

export class Validate extends null {
    /**
     * Validate that a value is a valid positive integer.
     * @param name The name.
     * @param value The value to validate.
     */
    public static integer(name: string, value: unknown, required: true): number;
    public static integer(name: string, value: unknown, required: false): number | undefined;
    public static integer(name: string, value: unknown, required: boolean) {
        const integer = Number.parseInt(String(value), 10);

        if (Number.isNaN(integer)) {
            if (!required) return undefined;
            throw new TypeError('InvalidType', name, 'number');
        } else if (integer < 0) {
            throw new RangeError('MustBePositive', name, integer);
        } else return integer;
    }

    /**
     * Validate that a value is a function.
     * @param name The name.
     * @param value The value to validate.
     */
    public static function(name: string, value: unknown, required: false): Function;
    public static function(name: string, value: unknown, required: true): Function | undefined;
    public static function(name: string, value: unknown, required: boolean) {
        if (typeof value === 'function') {
            return value;
        } else {
            if (!required) return undefined;
            throw new TypeError('InvalidType', name, 'function');
        }
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
            guildCount: this.function('guildCount', typedOptions['guildCount'], true),
            userCount: this.function('userCount', typedOptions['userCount'], true),
            shardCount: this.function('shardCount', typedOptions['shardCount'], true),
            voiceConnectionCount: this.function(
                'voiceConnectionCount',
                typedOptions['voiceConnectionCount'],
                true
            ),
        }) as Poster.Options;
    }

    public static webhookOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'options', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            port: this.integer('port', typedOptions['port'], true),
            handleAfterVote: this.function(
                'handleAfterVote',
                typedOptions['handleAfterVote'],
                false
            ),
        }) as Webhook.Options;
    }

    /**
     * Validate that the value is valid bot statistics options.
     * @param options The value to validate.
     */
    public static statisticsOptions(options: unknown) {
        if (typeof options !== 'object' || options === null)
            throw new TypeError('InvalidType', 'options', 'record');
        const typedOptions = options as Record<string, unknown>;

        return Utilities.deleteUndefinedProperties({
            guildCount: this.integer('guildCount', typedOptions['guildCount'], true),
            userCount: this.integer('userCount', typedOptions['userCount'], true),
            shardCount: this.integer('shardCount', typedOptions['shardCount'], true),
            voiceConnectionCount: this.integer(
                'voiceConnectionCount',
                typedOptions['voiceConnectionCount'],
                true
            ),
        }) as List.StatisticsOptions;
    }
}
