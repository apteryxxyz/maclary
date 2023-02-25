<div align="center">
    <h1><b>Maclary</b></h1><br/>
    <h3>A framework intended for making the process of creating complex Discord bots easier</h3><br/>
    <code>npm install maclary discord.js@dev</code><br/>
    <code>yarn add maclary discord.js@dev</code/><br/>
    <code>pnpm add maclary discord.js@dev</code><br/>
</div>

</div>

<div align="center">

[![Version](https://img.shields.io/npm/v/maclary?color=red&label=maclary)](https://github.com/maclary/maclary)
[![Total Downloads](https://img.shields.io/npm/dt/maclary)](https://npmjs.com/maclary)

</div>

## 🤔 About

`maclary` is a Discord bot framework intended for making the process of
creating complex Discord bots easier.

<div align="center" style="padding-top: 2rem; padding-bottom: 1rem">

| **Documentation and guides coming soon** |
| ---------------------------------------- |

</div>

### Features

- Built-in command, listener and interaction handling
- Create both slash and prefix commands
- Use of preconditions and message arguments
- Directory based subcommand creation system
- Ability to use community-made plugins
- Written in TypeScript

## 🌐 Examples

Maclary requires version >=14.7.0 of Discord.js in order to work.

> **_NOTE:_** It is important that you include the `main` field within your `package.json`, this is used to find your commands, listeners and actions.

These examples show how to use `maclary` in TypeScript, however it will work in JavaScript with `require` or `import`.

> src/index.ts

```ts
import { Client } from 'discord.js';
import { Maclary } from 'maclary';

const client = new Client({ ... });
const maclary = new Maclary({ ... });
Maclary.init(maclary, client);

client.login("DISCORD BOT TOKEN");
```

> src/commands/echo.ts

```ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command, Preconditions } from 'maclary';

function makePingMeButton(userId: string) {
    return new ActionRowBuilder().addComponents([
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
        const content = input.options.getString('input');
        const components = [makePingMeButton(input.user.id)];
        await input.reply({ content, components });
    }

    public override async onPrefix(message: Command.Message, args: Command.Arguments) {
        const content = args.rest();
        const components = [makePingMeButton(message.author.id)];
        await message.reply({ content, components });
    }
}
```

> src/actions/pingUser.js

```ts
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
```

And that is it! Maclary will handle the rest.

More documention and guides will come when the website is ready.
