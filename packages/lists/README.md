<div align="center">
    <h1>Maclary Lists</h1><br/>
    <h3>Statistics auto poster for all major Discord bot lists</h3><br/>
    <code>npm install @maclary/lists</code><br/>
    <code>yarn add @maclary/lists</code/><br/>
    <code>pnpm add @maclary/lists</code><br/>
</div>

<div align="center">

[![Version](https://img.shields.io/npm/v/@maclary/lists?color=red&label=@maclary/lists)](https://github.com/apteryxxyz/maclary/main/packages/lists)
[![Total Downloads](https://img.shields.io/npm/dt/@maclary/lists)](https://npmjs.com/maclary)

</div>

## 🤔 About

Lists is a library that helps you post your bot's statistics to all the Discord bot lists you want. It's easy to use and supports all the major bot lists. Lists is still in its early stages, many more features are planned. If you find any bugs or have any suggestions, please open an issue.

## 📚 Documentation

<div align="center" style="padding-top: 2rem; padding-bottom: 1rem">

| **Documentation and guides coming soon** |
| ---------------------------------------- |

</div>

## 🌐 Examples

An example is worth a thousand words. This example shows how to use the library in TypeScript, but it also works in JavaScript using either `require` or `import`.

```ts
import { Poster, Lists } from '@maclary/lists';

const lists = [
    new Lists.TopGG('botid', 'top api token'),
    new Lists.DiscordsCom('botid', 'discords api token'),
    ...
];

// This example uses 'discord.js' and '@discordjs/voice'
const poster = new Poster(lists, {
    shardCount: () => client.shard?.count ?? 1,
    guildCount: () => client.guilds.cache.size,
    userCount: () => client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    // 'getGroups' is a function within '@discordjs/voice', you may prefer to just return 0
    voiceConnectionCount: () => getGroups().reduce((a, b) => a + b.size, 0),
});

poster.startAutoPoster();
poster.stopAutoPoster();
```

## 🤖 Supported Bot Lists

<table>
  <thead>
    <tr>
      <th>Icon</th>
      <th>Name</th>
      <th>Website</th>
      <th>Class Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td><img src="https://blist.xyz/main_site/staticfiles/main/assets/blist.png" width="32" height="32" /></td>
        <td>Blist</td>
        <td><a href="https://blist.xyz">blist.xyz</a></td>
        <td>Blist</td>
    </tr>
    <tr>
        <td><img src="https://docs.botlist.me/icon.png" width="32" height="32" /></td>
        <td>Botlist.me</td>
        <td><a href="https://botlist.me">botlist.me</a></td>
        <td>BotListMe</td>
    </tr>
    <tr>
        <td><img src="https://bots.ondiscord.xyz/favicon/android-chrome-256x256.png" width="32" height="32" /></td>
        <td>Bots on Discord</td>
        <td><a href="https://bots.ondiscord.xyz">bots.ondiscord.xyz</a></td>
        <td>BotsOnDiscord</td>
    </tr>
    <tr>
        <td><img src="https://discordbotlist.com/android-icon-192x192.png" width="32" height="32" /></td>
        <td>Discord Bot List</td>
        <td><a href="https://discordbotlist.com">discordbotlist.com</a></td>
        <td>DiscordBotList</td>
    </tr>
    <tr>
        <td><img src="https://cdn.discord-botlist.eu/pictures/logo.png" width="32" height="32" /></td>
        <td>discord-botlist.eu</td>
        <td><a href="https://discord-botlist.eu">discord-botlist.eu</a></td>
        <td>DiscordBotListEU</td>
    </tr>
    <tr>
        <td><img src="https://pbs.twimg.com/profile_images/1071582837030060032/kKV-I01n_400x400.jpg" width="32" height="32" /></td>
        <td>Discord Bots</td>
        <td><a href="https://discord.bots.gg">discord.bots.gg</a></td>
        <td>DiscordBots</td>
    </tr>
    <tr>
        <td><img src="https://get.snaz.in/4KjWg91.png" width="32" height="32" /></td>
        <td>Discord Extreme List</td>
        <td><a href="https://discordextremelist.xyz">discordextremelist.xyz</a></td>
        <td>DiscordExtremeList</td>
    </tr>
    <tr>
        <td><img src="https://avatars2.githubusercontent.com/u/54491479?v=4" width="32" height="32" /></td>
        <td>Discord Labs</td>
        <td><a href="https://bots.discordlabs.org">bots.discordlabs.org</a></td>
        <td>DiscordLabs</td>
    </tr>
    <tr>
        <td><img src="https://avatars.githubusercontent.com/u/68995595" width="32" height="32" /></td>
        <td>Discordlist</td>
        <td><a href="https://discordlist.gg">discordlist.gg</a></td>
        <td>DiscordList</td>
    </tr>
    <tr>
        <td><img src="https://discords.com/bots/img/manifest/icon-512x512.png" width="32" height="32" /></td>
        <td>Discords.com</td>
        <td><a href="https://discords.com/bots">discords.com</a></td>
        <td>DiscordsCom</td>
    </tr>
    <tr>
        <td><img src="https://discordservices.net/icon.png" width="32" height="32" /></td>
        <td>Discord Services</td>
        <td><a href="https://discordservices.net">discordservices.net</a></td>
        <td>DiscordServices</td>
    </tr>
    <tr>
        <td><img src="https://disforge.com/assets/img/ui/categories/all-bots.png" width="32" height="32" /></td>
        <td>Disforge</td>
        <td><a href="https://disforge.com/bots">disforge.com</a></td>
        <td>Disforge</td>
    </tr>
    <tr>
        <td><img src="https://i.imgur.com/x0LCfAh.png" width="32" height="32" /></td>
        <td>Infinity Bot List</td>
        <td><a href="https://infinitybotlist.com">infinitybotlist.com</a></td>
        <td>InfinityBotList</td>
    </tr>
    <tr>
        <td><img src="https://i.imgur.com/16NcFql.png" width="32" height="32" /></td>
        <td>Motion Botlist</td>
        <td><a href="https://www.motiondevelopment.top/bot">motiondevelopment.top</a></td>
        <td>MotionBotList</td>
    </tr>
    <tr>
        <td><img src="https://topcord.xyz/icons/TopCord.png" width="32" height="32" /></td>
        <td>TopCord</td>
        <td><a href="https://topcord.xyz">topcord.xyz</a></td>
        <td>TopCord</td>
    </tr>
    <tr>
        <td><img src="https://top.gg/favicon.ico" width="32" height="32" /></td>
        <td>Top.gg</td>
        <td><a href="https://top.gg">top.gg</a></td>
        <td>TopGG</td>
    </tr>
    <tr>
        <td><img src="https://i.imgur.com/VOVfYV7.png" width="32" height="32" /></td>
        <td>Universe List</td>
        <td><a href="https://universe-list.xyz">universe-list.xyz</a></td>
        <td>UniverseList</td>
    </tr>
    <tr>
        <td><img src="https://files.gitbook.com/v0/b/gitbook-legacy-files/o/spaces%2F-MFw3t62urLlBeats8UJ%2Favatar-1598748054479.png?alt=media" width="32" height="32" /></td>
        <td>Void Bots</td>
        <td><a href="https://voidbots.net">voidbots.net</a></td>
        <td>VoidBots</td>
    </tr>
    <tr>
        <td><img src="https://get.snaz.in/8Jk3EJg.png" width="32" height="32" /></td>
        <td>Wonder Bot List</td>
        <td><a href="https://wonderbotlist.com/en">wonderbotlist.com</a></td>
        <td>WonderBotList</td>
    </tr>
    <tr>
        <td><img src="https://i.imgur.com/OFiMern.png" width="32" height="32" /></td>
        <td>Yet Another Bot List</td>
        <td><a href="https://yabl.xyz">yabl.xyz</a></td>
        <td>YABL</td>
    </tr>
  </tbody>
</table>