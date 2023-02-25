import 'dotenv/config';
import * as process from 'node:process';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary } from 'maclary';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});

const maclary = new Maclary({ defaultPrefix: '!', guildId: '990277337352372254' });

Maclary.init(maclary, client);

void client.login(process.env['DISCORD_TOKEN']!);
