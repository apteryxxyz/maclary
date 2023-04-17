import { EventEmitter } from 'node:events';
import { clearInterval, setInterval } from 'node:timers';
import type { List } from './List';
import type { RequestError } from '~/errors/RequestError';
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
     * Send your client statistics to all bot lists.
     */
    public async postStatistics() {
        const options = await this._buildStatisticsOptions();

        const promises: Promise<void>[] = [];
        for (const list of this.lists.values()) promises.push(list.postStatistics(options));
        await Promise.all(promises);
    }

    /**
     * Start automatically posting statistics to all bot lists.
     * @param interval The interval in milliseconds, defaults to 30 minutes.
     */
    public startAutoPoster(interval: number = 1_800_000) {
        if (this._autoPostInterval) this.stopAutoPoster();

        this._autoPostInterval = setInterval(async () => {
            const options = await this._buildStatisticsOptions();

            const promises: Promise<void>[] = [];
            const errors: RequestError[] = [];
            for (const list of this.lists.values())
                promises.push(list.postStatistics(options).catch(error => void errors.push(error)));
            await Promise.all(promises);

            if (errors.length) this.emit(Poster.Events.AutoPostFail, options, errors);
            else this.emit(Poster.Events.AutoPostSuccess, options);
        }, interval);
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
    private async _buildStatisticsOptions(): Promise<List.StatisticsOptions> {
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
        AutoPostSuccess = 'autoPostSuccess',
        AutoPostFail = 'autoPostFail',
    }

    export interface EventParams {
        [Events.AutoPostSuccess]: [options: List.StatisticsOptions];
        [Events.AutoPostFail]: [options: List.StatisticsOptions, errors: RequestError[]];
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
