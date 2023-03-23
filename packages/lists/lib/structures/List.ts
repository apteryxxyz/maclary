import { EventEmitter } from 'node:events';
import { URL } from 'node:url';
import { Error } from '~/errors/BotListsError';
import { Request } from '~/utilities/Request';

export abstract class List extends EventEmitter {
    /**
     * The unique identifer for this list.
     * @since 0.1.0
     */
    public abstract readonly key: string;

    /**
     * The name of this list.
     * @since 0.1.0
     */
    public abstract readonly title: string;

    /**
     * A link to this lists logo.
     * @since 0.1.0
     */
    public abstract readonly logoUrl: string;

    /**
     * A link to this lists website.
     * @since 0.1.0
     */
    public abstract readonly websiteUrl: string;

    /**
     * The base URL for this lists API.
     * @since 0.1.0
     */
    public abstract readonly apiUrl: string;

    /**
     * ID of the bot.
     * @since 0.1.0
     */
    public readonly clientId: string;

    /**
     * API token for this list that belongs to the client.
     * @since 0.1.0
     */
    public readonly apiToken: string;

    // /**
    //  * Webhook token for this list that belongs to the client.
    //  * @since 0.2.0
    //  */
    // public readonly webhookToken?: string;

    /**
     * @param clientId The ID of the bot.
     * @param apiToken The API token for this list.
     * @since 0.1.0
     */
    public constructor(clientId: string, apiToken: string) {
        super();

        this.clientId = clientId;
        this.apiToken = apiToken;
    }

    // public constructor(clientId: string, apiToken: string, webhookToken?: string) {
    //     super();

    //     this.clientId = clientId;
    //     this.apiToken = apiToken;
    //     this.webhookToken = webhookToken;
    // }

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

        return Request.perform<R>(method, new URL(path, this.apiUrl), options);
    }

    /**
     * Format the API token for this list.
     * For example if the token requires a token type.
     * @since 0.1.0
     */
    protected _formatApiToken() {
        return this.apiToken;
    }

    /**
     * Post your client statistics to this list.
     * @param options The options to post.
     * @since 0.1.0
     */
    public abstract postStatistics(options: List.PostOptions): Promise<void>;
}

export namespace List {
    export enum Events {
        PostSuccess = 'postSuccess',
        PostError = 'postError',
    }

    export interface EventParams {
        [Events.PostSuccess]: [options: PostOptions];
        [Events.PostError]: [options: PostOptions, error: Error];
    }

    export interface PostOptions {
        guildCount: number;
        userCount: number;
        shardCount: number;
        voiceConnectionCount: number;
    }
}
