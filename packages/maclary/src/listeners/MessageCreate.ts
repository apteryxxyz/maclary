import type { Command } from '~/structures/Command';
import { Listener } from '~/structures/Listener';
import { Events } from '~/utilities/Events';

export class OnMessageCreate extends Listener<typeof Events.MessageCreate> {
    public constructor() {
        super({ event: Events.MessageCreate });
    }

    public override run(message: Command.Message) {
        if (!message.client.isReady()) return;

        if (message.author.bot || message.system || message.webhookId) return;

        this.container.client.emit(Events.UserMessage, message);
    }
}
