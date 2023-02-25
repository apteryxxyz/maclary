import { MapManager } from './BaseManager';
import { Plugin } from '~/structures/Plugin';
import { _broadcastDestory, _broadcastPreparing, _broadcastReady } from '~/symbols';

/**
 * The {@link Plugin} manager.
 * You should never need to create an instance of this.
 * @since 1.0.0
 */
export class PluginManager extends MapManager<string, Plugin> {
    /**
     * Tell the client to use a plugin.
     * @template P The type of the plugin.
     * @param plugin The plugin to use.
     * @param args The arguments to pass to the plugins constructor.
     * @since 1.0.0
     */
    public use<P extends typeof Plugin>(plugin: P, ...args: ConstructorParameters<P>): void;

    /**
     * Tell the client to use a plugin.
     * @param plugin The plugin to use.
     * @since 1.0.0
     */
    public use(plugin: Plugin): void;

    public use<P extends Plugin | typeof Plugin>(
        plugin: P,
        ...args: P extends typeof Plugin ? ConstructorParameters<P> : never
    ) {
        if (plugin instanceof Plugin) {
            this.cache.set(plugin.name, plugin);
        } else if (typeof plugin === 'function' && plugin.prototype instanceof Plugin) {
            // @ts-expect-error 2511 Access abstract class
            const plug = new plugin(...args);
            this.cache.set(plug.name, plug);
        }
    }

    /**
     * Get a plugin from the cache by its name.
     * @template K The key name of the plugin.
     * @param name The name of the plugin.
     * @since 1.0.0
     */
    public get<K extends keyof Plugin.KeyMap>(name: K): Plugin.KeyMap[K] | undefined {
        return this.cache.get(name as string);
    }

    /** @internal */ public async [_broadcastPreparing]() {
        for (const plugin of this.cache.values())
            if (typeof plugin.onPreparing === 'function') await plugin.onPreparing();
    }

    /** @internal */ public async [_broadcastReady]() {
        for (const plugin of this.cache.values()) //
            if (typeof plugin.onReady === 'function') await plugin.onReady();
    }

    /** @internal */ public async [_broadcastDestory]() {
        for (const plugin of this.cache.values())
            if (typeof plugin.onDestory === 'function') await plugin.onDestory();
    }
}
