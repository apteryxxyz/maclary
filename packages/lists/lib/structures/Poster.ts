import { EventEmitter } from 'node:events';
import { clearInterval, setInterval } from 'node:timers';
import type { List } from './List';
import type { KeyOfLists } from '~/lists';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class Poster extends EventEmitter {
    public readonly lists: ReadonlyMap<KeyOfLists, List>;
    public readonly options: Poster.Options;

    private _autoPostInterval: NodeJS.Timeout | null = null;

    public constructor(lists: List[], options: Poster.Options) {
        super();

        const listEntries = lists.map(list => [list.key, list] as [KeyOfLists, List]);
        this.lists = Utilities.makeReadonlyMap(listEntries);

        // TODO: Validate options
        this.options = options;
    }

    public async postStatistics() {
        const options = await this._buildPostOptions();

        const promises: Promise<void>[] = [];
        for (const list of this.lists.values()) await list.postStatistics(options);
        await Promise.all(promises);
        this.emit(Poster.Events.AllPostDone, options);
    }

    private async _buildPostOptions(): Promise<List.PostOptions> {
        const guildCount = await this.options.guildCount();
        const userCount = await this.options.userCount();
        const shardCount = await this.options.shardCount();
        const voiceConnectionCount = await this.options.voiceConnectionCount();

        return Validate.postOptions({
            guildCount,
            userCount,
            shardCount,
            voiceConnectionCount,
        });
    }

    public startAutoPost(interval: number = 1_800_000) {
        if (this._autoPostInterval) this.stopAutoPost();
        this._autoPostInterval = setInterval(() => this.postStatistics(), interval);
    }

    public stopAutoPost() {
        if (!this._autoPostInterval) return;
        clearInterval(this._autoPostInterval);
        this._autoPostInterval = null;
    }
}

export namespace Poster {
    export enum Events {
        AllPostDone = 'allPostDone',
    }

    export interface EventParams {
        [Events.AllPostDone]: [options: List.PostOptions];
    }

    export interface Options {
        guildCount(): Promise<number> | number;
        userCount(): Promise<number> | number;
        shardCount(): Promise<number> | number;
        voiceConnectionCount(): Promise<number> | number;
    }
}
