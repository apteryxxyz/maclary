<div align="center">
    <h1>Maclary Context</h1><br/>
    <h3>Convert Discord messages and chat input into a single common object</h3><br/>
    <code>npm install @maclary/context</code><br/>
    <code>yarn add @maclary/context</code/><br/>
    <code>pnpm add @maclary/context</code><br/>
</div>

<div align="center">

[![Version](https://img.shields.io/npm/v/@maclary/context?color=red&label=@maclary/context)](https://github.com/apteryxxyz/maclary/main/packages/context)
[![Total Downloads](https://img.shields.io/npm/dt/@maclary/context)](https://npmjs.com/maclary)

</div>

## 🤔 About

Context is a library that allows you to convert Discord.js messages and chat inputs into a single common object. This allows you to easily create commands that work as both slash and prefix commands.

## 📚 Documentation

<div align="center" style="padding-top: 2rem; padding-bottom: 1rem">

| **Documentation and guides coming soon** |
| ---------------------------------------- |

</div>

## 🌐 Examples

An example is worth a thousand words. This example shows how to use the library in TypeScript, but it also works in JavaScript using either `require` or `import`.

```ts
import { Context } from '@maclary/context';

client.on('messageCreate', async message => {
    if (message.content !== '!hello') return;
    const context = new Context(message);
    return handleCommand(context);
});

client.on('interactionCreate', async interaction => {
    if (interaction.commandName !== 'hello') return;
    const context = new Context(interaction);
    return handleCommand(context);
});

async function handleCommand(context: Context) {
    await context.deferReply();
    // interaction: `interaction.deferReply()`
    // message: `message.channel.sendTyping()`

    await context.editReply(`Hello ${context.user.username}`);
    // interaction: `interaction.editReply()`
    // message: `reply = message.reply()`

    await context.followUp('How are you?');
    // interaction: `interaction.followUp()`
    // message: `message.reply()`

    await context.editReply(`Bye ${context.user.username}`);
    // interaction: `interaction.editReply()`
    // message: `reply.edit()`

    await context.deleteReply();
    // interaction: `interaction.deleteReply()`
    // message: `reply.delete()`
}
```
