import EventEmitter from 'node:events';
import { URL } from 'node:url';
import { Error } from '~/errors/ListsError';
import type { RequestError } from '~/errors/RequestError';
import { Request } from '~/utilities/Request';

/**
 * Each bot list class will extend this class.
 */
export abstract class List extends EventEmitter {
    /** The unique identifer for this list. */
    public abstract readonly key: string;
    /** The name of this list. */
    public abstract readonly title: string;
    /** A link to this lists logo. */
    public abstract readonly logoUrl: string;
    /** A link to this lists website. */
    public abstract readonly websiteUrl: string;
    /** The base URL for this lists API. */
    public abstract readonly apiUrl: string;
    /** ID of the bot. */
    public readonly clientId: string;
    /** API token for this list that belongs to the client. */
    public readonly apiToken: string;

    /**
     * @param clientId The ID of the bot.
     * @param apiToken The API token for this list.
     */
    public constructor(clientId: string, apiToken: string) {
        super();

        this.clientId = clientId;
        this.apiToken = apiToken;
    }

    /**
     * Perform a request to this lists API.
     * @param method Request method.
     * @param path Path to request.
     * @param options Request options.
     */
    protected _performRequest<D>(
        method: string,
        path: string,
        options: Request.Options & Request.AdditionalOptions = {}
    ) {
        if (!options.headers) options.headers = {};
        options.headers['Authorization'] ??= this._formatApiToken();

        if (options.requiresApiToken && !options.headers['Authorization'])
            throw new Error('MissingAPIToken', this.title);

        return Request.perform<D>(method, new URL(this.apiUrl + path), options);
    }

    /**
     * Format the API token for this list.
     * For example if the token requires a token type.
     */
    protected _formatApiToken() {
        return this.apiToken;
    }
}

export namespace List /* Events */ {
    export enum Events {
        StatisticsPostingSuccess = 'statisticsPostingSuccess',
        StatisticsPostingFailure = 'statisticsPostingFailure',
    }

    export interface EventParams {
        [Events.StatisticsPostingSuccess]: [StatisticsOptions];
        [Events.StatisticsPostingFailure]: [StatisticsOptions, RequestError];
    }
}

export namespace List /* Options */ {
    /** The statistics options to post to a list. */
    export interface StatisticsOptions {
        /** The number of guilds. */
        guildCount: number;
        /** The number of users. */
        userCount: number;
        /** The number of shards. */
        shardCount: number;
        /** The number of voice connections. */
        voiceConnectionCount: number;
    }
}

export namespace List /* Data */ {
    export interface Bot<R> {
        id: string;
        username: string;
        discriminator: string;
        avatarUrl: string;

        inviteUrl: string;
        supportUrl?: string;
        websiteUrl?: string;

        shortDescription: string;
        longDescription: string;

        raw: R;
    }

    export interface Server<R> {
        id: string;
        name: string;
        iconUrl: string;

        inviteUrl?: string;

        shortDescription: string;
        longDescription?: string;

        raw: R;
    }

    export interface User<R> {
        id: string;
        username: string;
        discriminator: string;
        avatarUrl: string;
        raw: R;
    }
}

export namespace List /* Implementations */ {
    export interface WithStatisticsPosting {
        /**
         * Send your client statistics to this list.
         * @param options The options to post.
         */
        postStatistics(options: StatisticsOptions): Promise<void>;
    }

    /**
     * Check if a list accepts sending client statistics.
     * @param list The list to check.
     */
    export function hasBotStatisticsPosting<L extends List>(
        list: L
    ): list is L & WithStatisticsPosting {
        return 'postStatistics' in list && typeof list.postStatistics === 'function';
    }

    export interface WithBotFetching {
        /**
         * Fetch an individual bot from this list.
         * @param id The ID of the bot to fetch.
         */
        getBot(id: string): Promise<Bot<unknown>>;
    }

    export interface WithUserBotsFetching {
        /**
         * Fetch all bots that belong to a user.
         * @param id The ID of the user to fetch.
         */
        getUserBots(id: string): Promise<Bot<unknown>[]>;
    }

    export interface WithServerFetching {
        /**
         * Fetch an individual server from this list.
         * @param id The ID of the server to fetch.
         */
        getServer(id: string): Promise<Server<unknown>>;
    }

    export interface WithUserServersFetching {
        /**
         * Fetch all servers that belong to a user.
         * @param id The ID of the user to fetch.
         */
        getUserServers(id: string): Promise<Server<unknown>[]>;
    }

    export interface WithUserFetching {
        /**
         * Fetch an individual user from this list.
         * @param id The ID of the user to fetch.
         */
        getUser(id: string): Promise<User<unknown>>;
    }

    export interface WithHasVotedFetching {
        /**
         * Check whether a user has voted for in the last 12 hours.
         * @param id The ID of the user to check.
         */
        hasVoted(id: string): Promise<boolean>;
    }
}
