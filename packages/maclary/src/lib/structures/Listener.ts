import EventEmitter from 'node:events';
import type { ClientEvents } from 'discord.js';
import { z } from 'zod';
import { Base } from './Base';
import { container } from '~/container';
import type { Awaitable } from '~/types';
import { Events } from '~/utilities/Events';

/**
 * All event listeners must extend this class and omplement its handler.
 * @template E The event this listener is for.
 * @since 1.0.0
 */
export abstract class Listener<E extends keyof ClientEvents>
    extends Base
    implements Listener.Options<E>
{
    public readonly emitter: EventEmitter;
    public readonly event: E;
    public readonly once: boolean;

    /**
     * @param options Options for this listener.
     * @since 1.0.0
     */
    public constructor(options: Listener.Options<E>) {
        super();

        const results = Listener.Options.Schema.parse(options);
        this.emitter = results.emitter;
        this.event = results.event as E;
        this.once = results.once;
    }

    /**
     * The handler for this event.
     * @param ...args The args this event passes.
     * @since 1.0.0
     */
    public abstract run(...args: ClientEvents[E]): Awaitable<unknown>;

    /** @internal */ public async _handleRun(...args: ClientEvents[E]) {
        const payload = { listener: this, args };

        try {
            if (typeof this.run !== 'undefined') {
                await this.run(...args);
                this.container.client.emit(Events.ListenerSuccess, payload);
                return;
            }

            throw new Error(`Listener "${this.event}" is missing its "run" handler.`);
        } catch (error) {
            let typedError = error as Error;
            if (!(error instanceof Error)) typedError = new Error(String(error));
            this.container.client.emit(Events.ListenerError, payload, typedError);
        }
    }
}

export namespace Listener {
    export interface Options<E extends keyof ClientEvents> {
        /**
         * The emitter to attach this listener to.
         * @default container.client
         * @since 1.0.0
         */
        emitter?: EventEmitter;

        /**
         * The event name that this listener should listen on.
         * @since 1.0.0
         */
        event: E;

        /**
         * Whether to remove this listener after its first execution.
         * @default false
         * @since 1.0.0
         */
        once?: boolean;
    }

    export namespace Options {
        export const Schema = z.object({
            emitter: z.instanceof(EventEmitter).default(() => container.client),
            event: z.string(),
            once: z.boolean().default(false),
        });
    }

    export interface Payload<E extends keyof ClientEvents = keyof ClientEvents> {
        listener: Listener<E>;
        args: ClientEvents[E];
    }
}
