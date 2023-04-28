import type { Action } from '~/structures/Action';
import { Listener } from '~/structures/Listener';
import type { Precondition } from '~/structures/Precondition';
import { Events } from '~/utilities/Events';

export class OnActionPreconditionFail extends Listener<typeof Events.ActionPreconditionFail> {
    public constructor() {
        super({ event: Events.ActionPreconditionFail });
    }

    public override async run(payload: Action.Payload, result: Precondition.Error) {
        const actionFailMessages = this.container.maclary.options.actionPreconditionFailMessages;
        const contentFn = actionFailMessages[result.identifier];
        const content = contentFn.bind(payload)(...result.parameters);

        const alreadyReplied = payload.from.deferred || payload.from.replied;
        const replyMethod = (alreadyReplied ? 'editReply' : 'reply') as 'reply';
        await payload.from[replyMethod]({ content, ephemeral: true });
        return void 0;
    }
}
