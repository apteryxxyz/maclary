import { URL } from 'node:url';

export class Request extends null {
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

        headers.append('User-Agent', 'UserAgent');
        headers.append('Content-Type', 'application/json');

        const body = options.body ? JSON.stringify(options.body) : undefined;

        return fetch(url, { method, headers, body }).then(res => res.json());
    }
}

export namespace Request {
    export interface Options {
        headers?: Record<string, unknown>;
        query?: Record<string, string | number | boolean>;
        body?: Record<string, unknown>;
    }

    export interface AdditionalOptions {
        requiresApiToken?: boolean;
    }
}
