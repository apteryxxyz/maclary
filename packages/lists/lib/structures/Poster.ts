import { EventEmitter } from 'node:events';
import { clearInterval, setInterval } from 'node:timers';
import type { List } from './List';
import type { KeyOfLists } from '~/lists';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

/**
 * The statistics poster class.
 */
export class Poster extends EventEmitter {
    /** The lists assigned to this poster. */
    public readonly lists: ReadonlyMap<KeyOfLists, List>;
    /** The options for this poster. */
    public readonly options: Poster.Options;
    /** The interval for automatically posting statistics. */
    private _autoPostInterval: NodeJS.Timeout | null = null;

    /**
     * @param lists The lists to post to.
     * @param options The poster options.
     */
    public constructor(lists: List[], options: Poster.Options) {
        super();

        const listEntries = lists.map(list => [list.key, list] as [KeyOfLists, List]);
        this.lists = Utilities.makeReadonlyMap(listEntries);
        this.options = Validate.posterOptions(options);
    }

    /**
     * Post your client statistics to all bot lists.
     */
    public async postStatistics() {
        const options = await this._buildPostOptions();

        const promises: Promise<void>[] = [];
        for (const list of this.lists.values()) promises.push(list.postStatistics(options));
        await Promise.all(promises);
        this.emit(Poster.Events.AllPostStatisticsDone, options);
    }

    /**
     * Start automatically posting statistics to all bot lists.
     * @param interval The interval in milliseconds, defaults to 30 minutes.
     */
    public startAutoPoster(interval: number = 1_800_000) {
        if (this._autoPostInterval) this.stopAutoPoster();
        this._autoPostInterval = setInterval(() => this.postStatistics(), interval);
    }

    /**
     * Stop automatically posting statistics to all bot lists.
     */
    public stopAutoPoster() {
        if (!this._autoPostInterval) return;
        clearInterval(this._autoPostInterval);
        this._autoPostInterval = null;
    }

    /**
     * Fetch statistics and build the options.
     */
    private async _buildPostOptions(): Promise<List.StatisticsOptions> {
        const guildCount = await this.options.guildCount();
        const userCount = await this.options.userCount();
        const shardCount = await this.options.shardCount();
        const voiceConnectionCount = await this.options.voiceConnectionCount();

        return Validate.statisticsOptions({
            guildCount,
            userCount,
            shardCount,
            voiceConnectionCount,
        });
    }
}

export namespace Poster {
    export enum Events {
        AllPostStatisticsDone = 'allPostStatisticsDone',
    }

    export interface EventParams {
        [Events.AllPostStatisticsDone]: [options: List.StatisticsOptions];
    }

    /** The poster options. */
    export interface Options {
        /** Function used to get guild count. */
        guildCount(): Promise<number> | number;
        /** Function used to get user count. */
        userCount(): Promise<number> | number;
        /** Function used to get shard count. */
        shardCount(): Promise<number> | number;
        /** Function used to get voice connection count. */
        voiceConnectionCount(): Promise<number> | number;
    }
}
