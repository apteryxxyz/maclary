import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command, Preconditions } from 'maclary';

function makePingMeButton(userId: string) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Ping Me!')
            .setCustomId(`pingUser,${userId}`),
    ]);
}

export class EchoCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash, Command.Kind.Prefix]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash, Command.Kind.Prefix],
            preconditions: [Preconditions.GuildOnly],
            name: 'echo',
            description: 'Echo the input.',
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'input',
                    description: 'The text to echo.',
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const content = input.options.getString('input') ?? '';
        const components = [makePingMeButton(input.user.id)];
        await input.reply({ content, components });
    }

    public override async onPrefix(message: Command.Message, args: Command.Arguments) {
        const content = args.rest();
        const components = [makePingMeButton(message.author.id)];
        await message.reply({ content, components });
    }
}
