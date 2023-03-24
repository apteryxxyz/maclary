import process from 'node:process';
import { URL } from 'node:url';

const UserAgent =
    `@maclary/lists@[VI]{{inject}}[/VI], node.js/${process.version}` as `@maclary/lists@${string}, node.js/${string}`;

export class Request extends null {
    /**
     * Perform a HTTP request.
     * @param method Request method.
     * @param init Request URL.
     * @param options Request options.
     */
    public static async perform<T>(
        method: string,
        init: string | URL,
        options: Request.Options
    ): Promise<T> {
        const url = new URL(String(init));
        for (const [key, value] of Object.entries(options.query ?? {}))
            url.searchParams.append(key, String(value));

        const headers = new Headers();
        for (const [key, value] of Object.entries(options.headers ?? {}))
            if (value) headers.set(key, String(value ?? ''));

        headers.append('User-Agent', UserAgent);
        headers.append('Content-Type', 'application/json');

        const body = options.body ? JSON.stringify(options.body) : undefined;

        return fetch(url, { method, headers, body }).then(res => res.json());
    }
}

export namespace Request {
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
