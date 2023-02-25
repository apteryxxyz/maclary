import type { CacheType, Interaction } from 'discord.js';
import type { Action } from '~/structures/Action';
import type { Command } from '~/structures/Command';
import { Listener } from '~/structures/Listener';
import { Events } from '~/utilities/Events';

export class OnInteractionCreate extends Listener<typeof Events.InteractionCreate> {
    public constructor() {
        super({ event: Events.InteractionCreate });
    }

    public override async run(interaction: Interaction<CacheType>) {
        if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
            return this._handleAction(interaction);
        }

        if (interaction.isCommand()) {
            return this._handleCommand(interaction);
        }

        if (interaction.isAutocomplete()) {
            const name = interaction.commandName;
            const command = this.container.maclary.commands.resolve(name) as any;
            if (!command) throw new Error(`Command "${name}" not found.`);
            await command._handleAutocomplete(interaction);
        }
    }

    private async _handleAction(interaction: Action.AnyInteraction) {
        const idSeparator = this.container.maclary.options.actionIdSeparator;
        const [id] = interaction.customId.split(idSeparator);
        // Any action with an ID that starts with _ will be ignored
        if (id.startsWith('_')) return;

        const action = this.container.maclary.actions.resolve(id) as any;
        if (!action) throw new Error(`Action "${id}" not found.`);
        const payload = { from: interaction, action };

        try {
            if (interaction.isButton()) await action._handleButton(interaction);
            if (interaction.isAnySelectMenu()) await action._handleSelectMenu(interaction);
            if (interaction.isModalSubmit()) await action._handleModalSubmit(interaction);
            this.container.client.emit(Events.ActionSuccess, payload);
        } catch (error) {
            let typedError = error as Error;
            if (!(error instanceof Error)) typedError = new Error(String(error));
            this.container.client.emit(Events.ActionError, payload, typedError);
        }
    }

    private async _handleCommand(interaction: Command.AnyInteraction) {
        const name = interaction.commandName;
        const command = this.container.maclary.commands.resolve(name) as any;
        if (!command) throw new Error(`Command "${name}" not found.`);
        const payload = { from: interaction, command };

        try {
            if (interaction.isChatInputCommand()) await command._handleSlash(interaction);
            if (interaction.isUserContextMenuCommand()) await command._handleUserMenu(interaction);
            if (interaction.isMessageContextMenuCommand())
                await command._handleMessageMenu(interaction);
            this.container.client.emit(Events.CommandSuccess, payload);
        } catch (error) {
            let typedError = error as Error;
            if (!(error instanceof Error)) typedError = new Error(String(error));
            this.container.client.emit(Events.CommandError, payload, typedError);
        }
    }
}
