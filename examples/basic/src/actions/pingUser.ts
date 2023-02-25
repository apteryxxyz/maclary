import { Action, Preconditions } from 'maclary';

export class PingUserAction extends Action {
    public constructor() {
        super({
            id: 'pingUser',
            preconditions: [Preconditions.GuildOnly],
        });
    }

    public override async onButton(button: Action.Button) {
        const [, userId] = button.customId.split(',');
        const user = await this.container.client.users.fetch(userId);
        await button.reply(user.toString());
    }
}
