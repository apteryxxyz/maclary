import type { PermissionResolvable, Snowflake } from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import { container } from '~/container';
import type { Action } from '~/structures/Action';
import type { Command } from '~/structures/Command';
import { Precondition } from '~/structures/Precondition';

const dmChannelPermissions = new PermissionsBitField([
    'SendMessages',
    // 'PinMessages',
    'EmbedLinks',
    'AttachFiles',
    'ReadMessageHistory',
    'MentionEveryone',
    'UseExternalEmojis',
    'UseExternalStickers',
    'AddReactions',
]);

/**
 * Precondition that ensures that the client has the required permissions.
 * @param permissions The permissions that the client needs to have.
 */
export function UserPermissions(permissions: PermissionResolvable) {
    const required = new PermissionsBitField(permissions);

    async function sharedRun(
        parent: Action.AnyInteraction | Command.AnyInteraction | Command.Message
    ) {
        const userId = 'author' in parent ? parent.author.id : parent.user.id;
        const permissions = await permissionsIn(userId, parent.channelId);
        return checkPermissions(required, permissions);
    }

    return class UserPermissions extends Precondition {
        public prefixRun = sharedRun;
        public slashRun = sharedRun;
        public contextMenuRun = sharedRun;
        public actionRun = sharedRun;
    };
}

async function permissionsIn(userId: Snowflake, channelId: Snowflake | null) {
    if (!channelId) return dmChannelPermissions;

    const channel = await container.client.channels.fetch(channelId);
    if (!channel || channel.isDMBased()) return dmChannelPermissions;

    return channel.permissionsFor(userId);
}

async function checkPermissions(
    required: PermissionsBitField,
    permissions: PermissionsBitField | null
) {
    if (!permissions) return Precondition.Result.error('CouldNotDetermineUserPermissions');

    const missing = permissions.missing(required);
    if (missing.length === 0) return Precondition.Result.ok();

    const missingField = new PermissionsBitField(missing);
    return Precondition.Result.error('UserPermissions', missingField);
}

declare module '~/structures/Precondition' {
    namespace Precondition {
        interface FailIdentifiers {
            CouldNotDetermineUserPermissions(): string;
            UserPermissions(missing: PermissionsBitField): string;
        }
    }
}
