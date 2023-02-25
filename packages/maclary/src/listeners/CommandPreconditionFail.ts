import { Command } from '~/structures/Command';
import { Listener } from '~/structures/Listener';
import type { Precondition } from '~/structures/Precondition';
import { Events } from '~/utilities/Events';

export class OnCommandPreconditionFail extends Listener<typeof Events.CommandPreconditionFail> {
    public constructor() {
        super({ event: Events.CommandPreconditionFail });
    }

    public override async run(payload: Command.Payload, result: Precondition.Error) {
        const actionFailMessages = this.container.maclary.options.actionPreconditionFailMessages;
        const contentFn = actionFailMessages[result.identifier];
        const textContent = contentFn.bind(payload)(...result.parameters);

        if (payload.from instanceof Command.Message) {
            await payload.from.reply(textContent);
        } else {
            const alreadyReplied = payload.from.deferred || payload.from.replied;
            const replyMethod = (alreadyReplied ? 'editReply' : 'reply') as 'reply';
            await payload.from[replyMethod](textContent);
        }

        return void 0;
    }
}
