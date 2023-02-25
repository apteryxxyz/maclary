import type { PermissionsBitField } from 'discord.js';
import type { Precondition } from '~/structures/Precondition';

export * from './BotOwnerOnly';
export * from './ClientPermissions';
export * from './DMOnly';
export * from './GuildOnly';
export * from './GuildOwnerOnly';
export * from './NSFWOnly';
export * from './UserPermissions';

export const ActionFailMessages: Precondition.FailIdentifiers = {
    BotOwnerOnly: () => 'Only the owner of this bot can use this.',
    CouldNotDetermineClientPermissions: () =>
        'I was unable to determine my own permissions within this channel.',
    CouldNotDetermineUserPermissions: () =>
        'I was unable to determine your permissions within this channel.',
    ClientPermissions: (missing: PermissionsBitField) =>
        `I need the following permissions to run this: ${missing.toArray().join(', ')}`,
    DMOnly: () => 'This can only be used in DMs.',
    GuildOnly: () => 'This can only be used within a server channel.',
    GuildOwnerOnly: () => 'Only the owner of this server can use this.',
    NSFWOnly: () => 'This can only be used within NSFW channels.',
    UserPermissions: (missing: PermissionsBitField) =>
        `You need the following permissions to run this: ${missing.toArray().join(', ')}`,
};

export const CommandFailMessages: Precondition.FailIdentifiers = {
    BotOwnerOnly: () => 'Only the owner of this bot can use this command.',
    CouldNotDetermineClientPermissions: () =>
        'I was unable to determine my own permissions within this channel.',
    CouldNotDetermineUserPermissions: () =>
        'I was unable to determine your permissions within this channel.',
    ClientPermissions: (missing: PermissionsBitField) =>
        `I need the following permissions to run this command: ${missing.toArray().join(', ')}`,
    DMOnly: () => 'This command can only be used in DMs.',
    GuildOnly: () => 'This command can only be used within a server channel.',
    GuildOwnerOnly: () => 'Only the owner of this server can use this command.',
    NSFWOnly: () => 'This command can only be used within NSFW channels.',
    UserPermissions: (missing: PermissionsBitField) =>
        `You need the following permissions to run this command: ${missing.toArray().join(', ')}`,
};
