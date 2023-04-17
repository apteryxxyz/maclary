import type { Client, Snowflake } from 'discord.js';
import { Message } from 'discord.js';
import { z } from 'zod';
import { Base } from './Base';
import type { Command } from './Command';
import type { Precondition } from './Precondition';
import { container } from '~/container';
import { ActionManager } from '~/managers/ActionManager';
import { CommandManager } from '~/managers/CommandManager';
import { ListenerManager } from '~/managers/ListenerManager';
import { PluginManager } from '~/managers/PluginManager';
import { ActionFailMessages, CommandFailMessages } from '~/preconditions';
import { _broadcastDestory, _broadcastPreparing, _broadcastReady } from '~/symbols';
import type { Awaitable } from '~/types';
import * as Regexes from '~/utilities/Regexes';

/**
 * The main Maclary class.
 * @example
 * ```typescript
 * import { Client } from 'discord.js';
 * import { Maclary } from 'maclary';
 *
 * const client = new Client({ ...clientOptions });
 * const maclary = new Maclary({ ...maclaryOptions });
 * Maclary.init(maclary, client);
 * ```
 * @since 1.0.0
 */
export class Maclary extends Base {
    public readonly options!: Required<
        Omit<Maclary.Options, 'guildId' | 'defaultPrefix' | 'regexPrefix'>
    > &
        Partial<Pick<Maclary.Options, 'guildId' | 'defaultPrefix' | 'regexPrefix'>>;

    /**
     * Maclarys {@link ActionManager}, which manages all {@link Action}s.
     * @since 1.0.0
     */
    public actions = new ActionManager();

    /**
     * Maclarys {@link CommandManager}, which manages all {@link Command}s.
     * @since 1.0.0
     */
    public commands = new CommandManager();

    /**
     * Maclarys {@link ListenerManager}, which manages all {@link Listener}s.
     * @since 1.0.0
     */
    public listeners = new ListenerManager();

    /**
     * Maclarys {@link PluginManager}, which manages all {@link Plugin}s.
     * @since 1.0.0
     */
    public plugins = new PluginManager();

    /**
     * @param options Options for this Maclary instance.
     * @since 1.0.0
     */
    public constructor(options: Maclary.Options) {
        super();

        const results = Maclary.Options.Schema.parse(options);
        Reflect.set(this, 'options', results);
    }

    /** @internal */ public async preparing() {
        for (const promise of [
            async () => this.listeners.load().then(async lis => lis.patch()),
            async () => this.actions.load().then(async act => act.patch()),
            async () => this.commands.load(),
            async () => this.plugins[_broadcastPreparing](),
        ])
            await promise();
    }

    /** @internal */ public async ready() {
        for (const promise of [
            async () => this.container.client.application.fetch(),
            async () => this.commands.patch(),
            async () => this.plugins[_broadcastReady](),
        ])
            await promise();
    }

    /** @internal */ public async destroy() {
        for (const promise of [async () => this.plugins[_broadcastDestory]()]) await promise();
    }
}

export namespace Maclary {
    export interface Options {
        /**
         * Whether prefix commands names should be case insensitive.
         * @default false
         * @since 1.0.0
         */
        caseInsensitiveCommands?: boolean;

        /**
         * Whether the prefix command prefixes should be case insensitive.
         * @default false
         * @since 1.0.0
         */
        caseInsensitivePrefixes?: boolean;

        /**
         * The default prefix for prefix commands.
         * @default []
         * @since 1.0.0
         */
        defaultPrefix?: string[] | string;

        /**
         * The message command regex prefix, an alternative to default string prefixes.
         * @since 1.0.0
         */
        regexPrefix?: RegExp;

        /**
         * A function that can use to have dynamic prefixes. Supports Promises.
         * @default () => defaultPrefix
         * @example
         * ```typescript
         * fetchPrefix: (message: Message) => db.prefixes.get(message.guild.id)
         * ```
         * @since 1.0.0
         */
        fetchPrefix?(message: Command.Message): Awaitable<string[] | string | null>;

        /**
         * Whether or not to disable the bots mention as a prefix command prefix.
         * @default false
         * @since 1.0.0
         */
        disableMentionPrefix?: boolean;

        /**
         * The prefix for command category directories.
         * @default '@'
         * @since 1.0.0
         */
        commandCategoryDirectoryPrefix?: string;

        /**
         * The prefix for command group directories.
         * @default '!'
         * @since 1.0.0
         */
        commandGroupDirectoryPrefix?: string;

        /**
         * The separator between the action ID and its arguments.
         * @default ','
         * @since 1.0.0
         */
        actionIdSeparator?: string;

        /**
         * Action precondtion fail messages.
         * @default {@link ActionFailMessages}
         * @since 1.0.0
         */
        actionPreconditionFailMessages?: Precondition.FailIdentifiers;

        /**
         * Command precondtion fail messages.
         * @default {@link CommandFailMessages}
         * @since 1.0.0
         */
        commandPreconditionFailMessages?: Precondition.FailIdentifiers;

        /**
         * By default, Maclary will register commands globally,
         * use this to only register to one or more guilds.
         * @since 1.0.0
         */
        guildId?: Snowflake | Snowflake[];
    }

    export namespace Options {
        export const Schema = z.object({
            caseInsensitiveCommands: z.boolean().default(false),
            caseInsensitivePrefixes: z.boolean().default(false),

            defaultPrefix: z
                .union([
                    z.string().regex(Regexes.Prefix),
                    z.array(z.string().regex(Regexes.Prefix)),
                ])
                .optional(),
            regexPrefix: z.instanceof(RegExp).optional(),
            fetchPrefix: z
                .function()
                // @ts-expect-error Message is a private class
                .args(z.union([z.instanceof(Message), z.undefined()]))
                .returns(z.union([z.string(), z.array(z.string()), z.undefined()]))
                .default(() => () => container.maclary.options.defaultPrefix),
            disableMentionPrefix: z.boolean().default(false),

            actionIdSeparator: z.string().default(','),
            commandCategoryDirectoryPrefix: z.string().default('@'),
            commandGroupDirectoryPrefix: z.string().default('!'),

            actionPreconditionFailMessages: z
                .object(
                    Object.fromEntries(
                        Object.entries(ActionFailMessages).map(([key, value]) => [
                            key,
                            z.union([z.function().returns(z.string()), z.null()]).default(value),
                        ])
                    )
                )
                .default(ActionFailMessages),
            commandPreconditionFailMessages: z
                .object(
                    Object.fromEntries(
                        Object.entries(CommandFailMessages).map(([key, value]) => [
                            key,
                            z.union([z.function().returns(z.string()), z.null()]).default(value),
                        ])
                    )
                )
                .default(CommandFailMessages),

            guildId: z
                .union([
                    z.string().regex(Regexes.Snowflake),
                    z.array(z.string().regex(Regexes.Snowflake)),
                ])
                .optional(),
        });
    }

    /**
     * Inject Maclary methods into the `Client#login` and `Client#destroy` methods.
     * @param maclary Maclary instance.
     * @param client Discord Client instance.
     * @since 1.0.0
     */
    export function init(maclary: Maclary, client: Client) {
        if (container.maclary) throw new Error('Maclary already initialized.');
        if (container.client) throw new Error('Client already initialized.');

        container.maclary = maclary;
        container.client = client;

        const normalLogin = client.login.bind(client);
        Reflect.set(client, 'login', async (...args: any[]) => {
            await maclary.preparing();
            client.on('ready', () => maclary.ready());
            return normalLogin(...args);
        });

        const normalDestroy = client.destroy.bind(client);
        Reflect.set(client, 'destroy', async () => {
            await maclary.destroy();
            normalDestroy();
        });
    }
}
