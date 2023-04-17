import { EventEmitter } from 'node:events';
import { URL } from 'node:url';
import { Error } from '~/errors/ListsError';
import { Request } from '~/utilities/Request';

/**
 * Each bot list class must extend this class.
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
     * @template R The return type.
     */
    protected _performRequest<R>(
        method: string,
        path: string,
        options: Request.Options & Request.AdditionalOptions
    ) {
        if (!options.headers) options.headers = {};
        options.headers['Authorization'] ??= this._formatApiToken();

        if (options.requiresApiToken && !options.headers['Authorization'])
            throw new Error('MissingAPIToken', this.title);

        return Request.perform<R>(method, new URL(this.apiUrl + path), options);
    }

    /**
     * Format the API token for this list.
     * For example if the token requires a token type.
     */
    protected _formatApiToken() {
        return this.apiToken;
    }

    /**
     * Send your client statistics to this list.
     * @param options The options to post.
     */
    public abstract postStatistics(options: List.StatisticsOptions): Promise<void>;
}

export namespace List {
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
