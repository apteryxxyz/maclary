import { Utilities } from './Utilities';
import { RangeError, TypeError } from '~/errors/BotListsError';
import type { List } from '~/structures/List';

export class Validate extends null {
    public static count(value: unknown) {
        const count = Number.parseInt(String(value), 10);
        if (Number.isNaN(count)) throw new TypeError('InvalidCount');
        if (count < 0) throw new RangeError('NegitiveCount');
        return count;
    }

    public static postOptions(options: List.PostOptions) {
        return Utilities.deleteUndefinedProperties({
            guildCount: this.count(options.guildCount),
            userCount: this.count(options.userCount),
            shardCount: this.count(options.shardCount),
            voiceConnectionCount: this.count(options.voiceConnectionCount),
        });
    }
}

export namespace Validate {}
