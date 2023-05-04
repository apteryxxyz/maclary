import process from 'node:process';
import { URL } from 'node:url';
import { RequestError } from '~/errors/RequestError';

const UserAgent =
    `@maclary/lists@[VI]{{inject}}[/VI], node.js/${process.version}` as `@maclary/lists@${string}, node.js/${string}`;

export class Request extends null {
    /**
     * Perform a HTTP request.
     * @param method Request method.
     * @param init Request URL.
     * @param options Request options.
     */
    public static async perform<D>(
        method: string,
        init: string | URL,
        options: Request.Options
    ): Promise<D> {
        const url = new URL(String(init));
        for (const [key, value] of Object.entries(options.query ?? {}))
            url.searchParams.append(key, String(value));

        const headers = new Headers();
        for (const [key, value] of Object.entries(options.headers ?? {}))
            if (value) headers.set(key, String(value ?? ''));

        headers.append('User-Agent', UserAgent);
        headers.append('Content-Type', 'application/json');

        const body = options.body ? JSON.stringify(options.body) : undefined;
        const response = await fetch(url, { method, headers, body });
        if (response.ok) return response.json();

        const text = await response.text();
        throw new RequestError(response.statusText, text);
    }
}

export namespace Request /* Options */ {
    /** Request options. */
    export interface Options {
        /** Request headers. */
        headers?: Record<string, unknown>;
        /** Request URL query. */
        query?: Record<string, string | number | boolean>;
        /** Request body. */
        body?: Record<string, unknown>;
    }

    /** Additional request options. */
    export interface AdditionalOptions {
        /** Whether the request requires an API token. */
        requiresApiToken?: boolean;
    }
}
