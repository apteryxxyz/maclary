import type { Client } from 'discord.js';
import type { Maclary } from './structures/Maclary';
import type { ConsoleLike } from './types';

export interface Container<R extends boolean = true> {
    client: Client<R>;
    logger: ConsoleLike;
    maclary: Maclary;
}

/**
 * A container that can be used values that are
 * accessible anywhere in the project.
 * @since 1.0.0
 */
export const container: Container<true> = {
    client: null as unknown as Client<true>,
    logger: console,
    maclary: null as unknown as Maclary,
};
