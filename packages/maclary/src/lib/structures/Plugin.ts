import { s } from '@sapphire/shapeshift';
import { Base } from './Base';
import type { Awaitable } from '~/types';

/**
 * All plugins must extend this class and implement its abstract methods.
 * @since 1.0.0
 */
export abstract class Plugin extends Base implements Plugin.Options {
    public name: string;
    public description: string;
    public version: string;

    /**
     * @param options The options for the plugin.
     * @since 1.0.0
     */
    public constructor(options: Plugin.Options) {
        super();

        const results = Plugin.Options.Schema.parse(options);

        this.name = results.name;
        this.description = results.description;
        this.version = results.version;
    }

    /**
     * Run when the client is preparing to login.
     * @since 1.0.0
     */
    public onPreparing?(): Awaitable<unknown>;

    /**
     * Run once the client has logged in.
     * @since 1.0.0
     */
    public onReady?(): Awaitable<unknown>;

    /**
     * Run right before the clienr is destoryed.
     * @since 1.0.0
     */
    public onDestory?(): Awaitable<unknown>;
}

export namespace Plugin {
    export interface Options {
        /**
         * The name of the plugin.
         * @since 1.0.0
         */
        name: string;

        /**
         * A description for the plugin.
         * @since 1.0.0
         */
        description: string;

        /**
         * The version of the plugin.
         * @since 1.0.0
         */
        version: string;
    }

    export namespace Options {
        export const Schema = s.object({
            name: s.string,
            description: s.string,
            version: s.string,
        });
    }

    export interface KeyMap extends Record<string, Plugin> {}
}
