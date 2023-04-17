import * as Discord from 'discord.js';
import { z } from 'zod';
import { Base } from './Base';
import { Precondition } from '~/structures/Precondition';
import type { Awaitable } from '~/types';
import { Events } from '~/utilities/Events';

/**
 * All actions must extend this class and implement its handlers.
 * @since 1.0.0
 */
export abstract class Action extends Base implements Omit<Action.Options, 'preconditions'> {
    public readonly id: string;

    /**
     * The precondition container for this action.
     * @since 1.0.0
     */
    public readonly preconditions = new Precondition.Container<Action>(this);

    /**
     * @params options Options for this action.
     * @since 1.0.0
     */
    public constructor(options: Action.Options) {
        super();

        const results = Action.Options.Schema.parse(options);
        this.id = results.id;
        for (const pre of results.preconditions) this.preconditions.add(pre);
    }

    /**
     * Triggered when a button interaction is received with this actions ID.
     * @param button The button interaction.
     * @since 1.0.0
     */
    public onButton?(button: Action.Button): Awaitable<unknown>;

    /** @internal */ public async _handleButton(button: Action.Button) {
        const successful = await this._runPreconditions(button);
        if (!successful) return;

        if (typeof this.onButton === 'function') return this.onButton(button);
        throw new Error(`Action "${this.id}" is missing its "onButton" handler.`);
    }

    /**
     * Triggered when any select menu interaction is received with this actions ID.
     * @param menu The select menu interaction.
     * @since 1.0.0
     */
    public onSelectMenu?(menu: Action.AnySelectMenu): Awaitable<unknown>;

    /** @internal */ public async _handleSelectMenu(menu: Action.AnySelectMenu) {
        const successful = await this._runPreconditions(menu);
        if (!successful) return;

        if (typeof this.onSelectMenu === 'function') return this.onSelectMenu(menu);
        throw new Error(`Action "${this.id}" is missing its "onSelectMenu" handler.`);
    }

    /**
     * Triggered when a modal is submitted with this actions ID.
     * @param modal The modal submit interaction.
     */
    public onModalSubmit?(
        modal: Action.MessageModalSubmit | Action.ModalSubmit
    ): Awaitable<unknown>;

    /** @internal */ public async _handleModalSubmit(
        modal: Action.MessageModalSubmit | Action.ModalSubmit
    ) {
        const successful = await this._runPreconditions(modal);
        if (!successful) return;

        if (typeof this.onModalSubmit === 'function') return this.onModalSubmit(modal);
        throw new Error(`Action "${this.id}" is missing its "onModalSubmit" handler.`);
    }

    private async _runPreconditions(interaction: Action.AnyInteraction) {
        const payload = { from: interaction, action: this };

        const result = await this.preconditions.actionRun(interaction as any);
        if (Precondition.Result.isOk(result))
            this.container.client.emit(Events.ActionPreconditionPass, payload, result);
        else {
            this.container.client.emit(Events.ActionPreconditionFail, payload, result);
            return false;
        }

        return true;
    }
}

export namespace Action {
    export interface Options {
        /**
         * The ID of this action.
         * @since 1.0.0
         */
        id: string;

        /**
         * The preconditions for this action.
         * @see {@link Precondition}
         * @since 1.0.0
         */
        preconditions?: (typeof Precondition)[];
    }

    export namespace Options {
        export const Schema = z
            .object({
                id: z.string().max(100),
                preconditions: z.array(z.any()).default([]),
            })
            .refine(
                data => data.preconditions.every(pre => pre.prototype instanceof Precondition),
                {
                    message: 'All preconditions must be a subclass of Precondition.',
                    path: ['preconditions'],
                }
            );
    }

    export interface Payload {
        action: Action;
        from: AnyInteraction;
    }

    export type Button = Discord.ButtonInteraction;
    export const Button = Discord.ButtonInteraction;

    export type ChannelSelectMenu = Discord.ChannelSelectMenuInteraction;
    export const ChannelSelectMenu = Discord.ChannelSelectMenuInteraction;

    export type StringSelectMenu = Discord.StringSelectMenuInteraction;
    export const StringSelectMenu = Discord.StringSelectMenuInteraction;

    export type MentionableSelectMenu = Discord.MentionableSelectMenuInteraction;
    export const MentionableSelectMenu = Discord.MentionableSelectMenuInteraction;

    export type RoleSelectMenu = Discord.RoleSelectMenuInteraction;
    export const RoleSelectMenu = Discord.RoleSelectMenuInteraction;

    export type UserSelectMenu = Discord.UserSelectMenuInteraction;
    export const UserSelectMenu = Discord.UserSelectMenuInteraction;

    export type ModalSubmit = Discord.ModalSubmitInteraction;
    export const ModalSubmit = Discord.ModalSubmitInteraction;

    export type AnySelectMenu = Discord.AnySelectMenuInteraction;

    export type MessageModalSubmit = Discord.ModalMessageModalSubmitInteraction;
    export type AnyModalSubmit = MessageModalSubmit | ModalSubmit;

    export type AnyInteraction = AnySelectMenu | Button | ModalSubmit;
}
