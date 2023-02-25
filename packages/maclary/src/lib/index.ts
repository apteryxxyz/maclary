// Root
export * from './container';
export * from './symbols';
export * from './types';

// Managers
export * from './managers/ActionManager';
export * from './managers/BaseManager';
export * from './managers/CommandManager';
export * from './managers/ListenerManager';
export * from './managers/PluginManager';

// Precondtions
export * as Preconditions from './preconditions';

// Structures
export * from './structures/Action';
export * from './structures/Arguments';
export * from './structures/Base';
export * from './structures/Command';
export * from './structures/Listener';
export * from './structures/Maclary';
export * from './structures/Plugin';
export * from './structures/Precondition';

// Utilities
export * from './utilities/Events';
export * as Regexes from './utilities/Regexes';

/**
 * The module version that you are currently using.
 * @since 1.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{{init}}[/VI]';
