import type { Action } from '~/structures/Action';
import { Base } from '~/structures/Base';
import type { Command } from '~/structures/Command';
import type { Awaitable } from '~/types';

/**
 * Precondition class for commands and actions.
 * @since 1.0.0
 */
export abstract class Precondition extends Base {
    public ok() {
        return Precondition.Result.ok();
    }

    public error<Identifier extends keyof Precondition.FailIdentifiers>(
        identifier: Identifier,
        ...parameters: Parameters<Precondition.FailIdentifiers[Identifier]>
    ) {
        return Precondition.Result.error(identifier, ...parameters);
    }

    /**
     * Run this precondition for a prefix command.
     * @param message The message that triggered the command.
     * @param command The command that was triggered.
     * @since 1.0.0
     */
    public abstract prefixRun(
        message: Command.Message,
        command: Command<Command.Type.ChatInput, any>
    ): Awaitable<Precondition.Result>;

    /**
     * Run this precondition for a slash command.
     * @param input The interaction that triggered the command.
     * @param command The command that was triggered.
     * @since 1.0.0
     */
    public abstract slashRun(
        input: Command.ChatInput,
        command: Command<Command.Type.ChatInput, any>
    ): Awaitable<Precondition.Result>;

    /**
     * Run this precondition for a message or user context menu.
     * @param menu The interaction that triggered the action.
     * @param command The command that was triggered.
     * @since 1.0.0
     */
    public abstract contextMenuRun(
        menu: Command.ContextMenu,
        command: Command<Command.Type.ChatInput, any>
    ): Awaitable<Precondition.Result>;

    /**
     * Run this precondition for any action.
     * @param interaction The interaction that triggered the action.
     * @param action The action that was triggered.
     * @since 1.0.0
     */
    public abstract actionRun(
        interaction: Action.AnyInteraction,
        action: Action
    ): Awaitable<Precondition.Result>;
}

export namespace Precondition {
    /**
     * An interface of precondition error identifiers and their parameters.
     * @since 1.0.0
     */
    export interface FailIdentifiers extends Record<string, FailIdentifiers.Function> {}

    export namespace FailIdentifiers {
        export type Function = (this: Action.Payload | Command.Payload, ...rest: any[]) => string;
    }

    /**
     * Represents a successful precondition result.
     * @since 1.0.0
     */
    export interface Ok {
        success: true;
    }

    /**
     * Represents a failed precondition result.
     * @template Identifier The error identifier.
     * @since 1.0.0
     */
    export interface Error<Identifier extends keyof FailIdentifiers = keyof FailIdentifiers> {
        identifier: Identifier;
        parameters: Parameters<FailIdentifiers[Identifier]>;
        success: false;
    }

    /**
     * Represents a precondition result.
     * @since 1.0.0
     */
    export type Result = Error | Ok;

    export namespace Result {
        /**
         * Creates a successful precondition result.
         * @since 1.0.0
         */
        export function ok(): Ok {
            return { success: true };
        }

        /**
         * Creates a failed precondition result.
         * @param identifier The error identifier.
         * @param parameters The error parameters.
         * @since 1.0.0
         */
        export function error<Identifier extends keyof FailIdentifiers = keyof FailIdentifiers>(
            identifier: Identifier,
            ...parameters: Parameters<FailIdentifiers[Identifier]>
        ): Error<Identifier> {
            return { success: false, identifier, parameters };
        }

        /**
         * Checks if a value is a valid precondition result.
         * @param value The value to check.
         * @since 1.0.0
         */
        export function is(value: unknown): value is Result {
            return typeof value === 'object' && value !== null && 'success' in value;
        }

        /**
         * Checks if a value is a successful precondition result.
         * @param value The value to check.
         * @since 1.0.0
         */
        export function isOk(value: unknown): value is Ok {
            return is(value) && value.success;
        }

        /**
         * Checks if a value is a failed precondition result.
         * @param value The value to check.
         * @since 1.0.0
         */
        export function isError(value: unknown) {
            return is(value) && !value.success;
        }
    }

    /**
     * The container for preconditions.
     * @template Parent Whether this container is for commands or actions.
     * @since 1.0.0
     */
    export class Container<
        Parent extends Action | Command<any, any> = Action | Command<any, any>
    > extends Base {
        private readonly _entries: Precondition[] = [];

        private readonly _parent: Parent;

        /**
         * @param parent The parent of this container.
         * @since 1.0.0
         */
        public constructor(parent: Parent) {
            super();
            this._parent = parent;
        }

        /**
         * Add a precondition to this container.
         * @param preconditions The preconditions to add.
         * @since 1.0.0
         */
        public add(...preconditions: (typeof Precondition)[]) {
            for (const Precondition of preconditions) {
                if (!this._extendsPrecondition(Precondition)) return;
                // @ts-expect-error Fix abstract class
                const precondition = new Precondition();
                this._entries.push(precondition);
            }
        }

        /**
         * Run all the preconditions in this container for a slash command.
         * @param input The interaction that triggered the command.
         * @since 1.0.0
         */
        public async slashRun(input: Command.ChatInput) {
            for (const entrie of this._entries)
                if (typeof entrie.slashRun === 'function') {
                    const result = await entrie.slashRun(input, this._parent as any);
                    if (!result.success) return result;
                }

            return Result.ok();
        }

        /**
         * Run all the preconditions in this container for a prefix command.
         * @param message The message that triggered the command.
         * @since 1.0.0
         */
        public async prefixRun(message: Command.Message) {
            for (const entrie of this._entries)
                if (typeof entrie.prefixRun === 'function') {
                    const result = await entrie.prefixRun(message, this._parent as any);
                    if (!result.success) return result;
                }

            return Result.ok();
        }

        /**
         * Run all the preconditions in this container for a context menu command.
         * @param menu The interaction that triggered the command.
         * @since 1.0.0
         */
        public async contextMenuRun(menu: Command.ContextMenu) {
            for (const entrie of this._entries)
                if (typeof entrie.contextMenuRun === 'function') {
                    const result = await entrie.contextMenuRun(menu, this._parent as any);
                    if (!result.success) return result;
                }

            return Result.ok();
        }

        /**
         * Run all the preconditions in this container for any component action.
         * @param interaction The interaction that triggered the action.
         * @since 1.0.0
         */
        public async actionRun(interaction: Action.AnyInteraction) {
            for (const entrie of this._entries)
                if (typeof entrie.actionRun === 'function') {
                    const result = await entrie.actionRun(interaction, this._parent as any);
                    if (!result.success) return result;
                }

            return Result.ok();
        }

        private _extendsPrecondition(value: unknown): value is typeof Precondition {
            return typeof value === 'function' && value.prototype instanceof Precondition;
        }
    }
}
