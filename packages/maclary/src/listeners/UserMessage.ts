import { type Message, PermissionsBitField } from 'discord.js';
import { Listener } from '~/structures/Listener';
import { Events } from '~/utilities/Events';

const requiredPermissions = new PermissionsBitField(['ViewChannel', 'SendMessages']).freeze();

export class OnUserMessage extends Listener<typeof Events.UserMessage> {
    public constructor() {
        super({ event: Events.UserMessage });
    }

    public override async run(message: Message<boolean>) {
        const canRun = await this._canRunInChannel(message);
        if (!canRun) return void 0;

        const {
            client,
            maclary: { options },
        } = this.container;

        let prefix: RegExp | string | null = null;
        const mentionPrefix = this._getMentionPrefix(message);

        if (mentionPrefix) {
            if (message.content.length === mentionPrefix.length)
                return void client.emit(Events.ClientMention, message);
            prefix = mentionPrefix;
        } else if (options.regexPrefix?.test(message.content)) {
            prefix = options.regexPrefix;
        } else {
            const prefixes =
                typeof options.fetchPrefix === 'function'
                    ? await options.fetchPrefix(message)
                    : options.defaultPrefix;
            const parsed = this._getPrefix(message.content, prefixes);
            if (parsed !== null) prefix = parsed;
        }

        if (prefix === null) client.emit(Events.NonPrefixedMessage, message);
        else client.emit(Events.PrefixedMessage, message, prefix);
        return void 0;
    }

    private async _canRunInChannel(message: Message<boolean>) {
        if (!message.inGuild()) return true;

        const me = await message.guild.members.fetchMe();
        if (!me) return false;

        const permissions = message.channel.permissionsFor(me);
        return permissions.has(requiredPermissions);
    }

    private _getMentionPrefix(message: Message<boolean>) {
        const disableMentionPrefix = this.container.maclary.options.disableMentionPrefix;
        if (disableMentionPrefix) return null;
        if (message.content.length < 20 || !message.content.startsWith('<@')) return null;

        const botId = message.client.user.id;
        const roleId = message.inGuild() && message.guild.roles.botRoleFor(message.client.user)?.id;

        const mentionPrefix = new RegExp(`^<@(?:!|&)?(${botId}|${roleId})>`);
        const match = message.content.match(mentionPrefix);
        if (!match) return null;

        return match[0];
    }

    private _getPrefix(content: string, prefixes: string[] | string | null | undefined) {
        if (!prefixes?.length) return null;

        const caseInsensitivePrefixes = this.container.maclary.options.caseInsensitivePrefixes;
        if (caseInsensitivePrefixes) content = content.toLowerCase();

        function getStringPrefix(prefix: string) {
            if (caseInsensitivePrefixes) prefix = prefix.toLowerCase();
            return content.startsWith(prefix) ? prefix : null;
        }

        if (typeof prefixes === 'string') return getStringPrefix(prefixes);
        return prefixes.find(prefix => getStringPrefix(prefix) !== null) ?? null;
    }
}
