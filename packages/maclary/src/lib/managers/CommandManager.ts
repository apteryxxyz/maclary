import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ClientApplication, Guild } from 'discord.js';
import { SetManager } from './BaseManager';
import { compareCommands } from '~/internal/CompareCommands';
import { isDirectory, isFile, resolveDirectoryIndexPath } from '~/internal/FileResolver';
import { flattenTree } from '~/internal/ItemUtilities';
import { getModuleData, loadModule } from '~/internal/ModuleLoader';
import { Command } from '~/structures/Command';

/**
 * The {@link Command} manager.
 * You should never need to create an instance of this.
 * @since 1.0.0
 */
export class CommandManager extends SetManager<Command<any, any>> {
    /**
     * Loads a directory as a command group.
     * @since 1.0.0
     */
    public paths = new Set<string>();

    public constructor() {
        super();

        const rootPath = join(this.baseDirectory, 'commands');
        if (isDirectory(rootPath)) this.paths.add(rootPath);
        const internalPath = join(__dirname, '../..', 'commands');
        if (isDirectory(internalPath)) this.paths.add(internalPath);
    }

    /**
     * Load all of the commands from the paths and store them in the cache.
     * @since 1.0.0
     */
    public async load() {
        this.cache.clear();
        this.container.logger.info('Loading commands...');
        for (const path of this.paths) await this._loadItem(path);
        this.container.logger.info(`Loaded ${this.cache.size} commands`);
        return this;
    }

    /**
     * Patch all of the interaction commands to the appropriate applications.
     * @since 1.0.0
     */
    public async patch() {
        const { client, maclary, logger } = this.container;
        logger.info('Patching commands...');

        // Filter out the prefix only commands
        const commands = this._filterByKind(Array.from(this.cache), [
            Command.Kind.Slash,
            Command.Kind.Message,
            Command.Kind.User,
        ]);

        // Get the application or guilds to register these commands to
        const applications = maclary.options.guildId
            ? [maclary.options.guildId].flat().map(id => client.guilds.cache.get(id))
            : [client.application];

        const promises = [];
        for (const application of applications)
            if (application) promises.push(this._patchApplication(application, commands));

        const didPatch = await Promise.all(promises);
        if (didPatch.some(Boolean)) logger.info('Patched commands');
        else logger.info('Commands are already up to date');
        return this;
    }

    /**
     * Bulk remove all commands from the clients application and all guilds.
     * @since 1.0.0
     */
    public async unpatch() {
        const { client, logger } = this.container;
        const applications = [client.application, ...client.guilds.cache.values()];
        return Promise.all(applications.map(async app => app.commands.set([]))).then(() => {
            logger.info('Unpatched all commands');
            return this;
        });
    }

    /**
     * Resolve a command name to a command instance.
     * @param commandName The name of the command to resolve.
     * @param [commands] An optional array of commands to search through.
     * @since 1.0.0
     */
    public resolve(commandName: string, commands = Array.from(this.cache)) {
        const allowAnyCase = this.container.maclary.options.caseInsensitiveCommands;

        // IDEA: Allow use for command localisation with prefix commands
        // This would also allow for localisation information in prefix commands
        // I can't remember how I was going to do this
        return commands.find(cmd => {
            if (allowAnyCase) {
                const regex = new RegExp(cmd.name, allowAnyCase ? 'i' : '');
                return regex.test(commandName);
            } else return cmd.name === commandName;
        });
    }

    private async _patchApplication(
        application: ClientApplication | Guild,
        internalCommands: Command<any, any>[]
    ) {
        await application.commands.fetch({});
        const externalCommands = application.commands.cache.clone();
        const jsonCommands = internalCommands.flatMap(int => int.toJSON());

        // Only patch commands if there are any differences
        let shouldPatch = externalCommands.size !== jsonCommands.length;
        if (!shouldPatch)
            for (const internal of internalCommands) {
                const external = externalCommands.find(ext => ext.name === internal.name);
                if (!external) shouldPatch = true;
                if (shouldPatch) break;
                const differences = compareCommands(external, internal);
                if (differences.length > 0) shouldPatch = true;
            }

        if (shouldPatch) {
            await application.commands.set(jsonCommands);
            return true;
        } else return false;
    }

    private async _loadItem(itemPath: string, passOptions = {}) {
        const data = getModuleData(itemPath, true);
        if (!data) return;

        if (data.type === 'file') {
            const commands = await this._loadCommandsFromFile(data.path);
            if (commands.length === 0) return;
            for (const command of commands)
                this.cache.add(Object.assign(command, { _isBase: true, ...passOptions }));
        }

        if (data.type === 'directory') {
            const { commandCategoryDirectoryPrefix, commandGroupDirectoryPrefix } =
                this.container.maclary.options;

            // Directories that start with @ (default) are consided categories
            if (data.name.startsWith(commandCategoryDirectoryPrefix)) {
                const categoryName = data.name.slice(1).trim();
                await this._loadDirectoryAsCategory(data.path, categoryName);
            }

            // Directories that start with ! (default) will be loaded as command groups
            else if (data.name.startsWith(commandGroupDirectoryPrefix)) {
                await this._loadDirectoryAsCommandGroup(
                    data.path,
                    data.name.slice(1).trim(),
                    passOptions,
                    true
                );
            }

            // Just load it as a regular folder, with no categoryName
            else await this._loadDirectoryAsCategory(data.path);
        }
    }

    private async _loadDirectoryAsCategory(folderPath: string, categoryName = '') {
        if (!isDirectory(folderPath)) return;

        // Load the @category/index.js options file
        const categoryOptions = await this._loadDirectoryIndex<Command.CategoryOptions>(folderPath);
        if (!categoryOptions.category) categoryOptions.category = categoryName;

        for (const name of readdirSync(folderPath)) {
            const filePath = join(folderPath, name);
            await this._loadItem(filePath, categoryOptions);
        }
    }

    private async _loadDirectoryAsCommandGroup(
        folderPath: string,
        itemName: string,
        categoryOptions: Command.CategoryOptions = {},
        cache = false
    ) {
        // Load the !command/index.js options file
        const groupOptions = await this._loadDirectoryIndex<Command.GroupOptions>(folderPath);
        if (!groupOptions.name) groupOptions.name = itemName;

        const command = new (class extends Command<Command.Type.ChatInput, any> {
            public override _isBase = cache;

            public override _variety = Command.Variety.Group;

            public constructor() {
                super({
                    type: Command.Type.ChatInput,
                    kinds: [Command.Kind.Prefix, Command.Kind.Slash],
                    name: groupOptions.name ?? itemName,
                    nameLocalizations: groupOptions.nameLocalizations,
                    description: groupOptions.description ?? 'https://maclary.js.org',
                    descriptionLocalizations: groupOptions.descriptionLocalizations,
                    category: categoryOptions.category,
                    categoryLocalizations: categoryOptions.categoryLocalizations,
                });
            }
        })();

        const options = await this._loadDirectoryAsCommandOptions(folderPath, categoryOptions);
        Reflect.set(command, 'options', options.filter(this._isChatInputCommand));
        if (cache) this.cache.add(command);

        // Directly cache the context commands
        const contextCommands = options.filter(this._isContextMenuCommand);
        for (const cc of contextCommands) this.cache.add(cc);
        return command;
    }

    private async _loadDirectoryAsCommandOptions(
        folderPath: string,
        categoryOptions: Command.CategoryOptions = {}
    ) {
        const contentPaths = readdirSync(folderPath).map(name => join(folderPath, name));
        const contentDatas = contentPaths.map(path => getModuleData(path, true));

        const options = [];
        for (const data of contentDatas) {
            if (!data) continue;

            if (isFile(data.path)) {
                const commands = await this._loadCommandsFromFile(data.path);
                for (const command of commands)
                    Reflect.set(command, '_variety', Command.Variety.Command);
                options.push(...commands);
            } else {
                options.push(
                    await this._loadDirectoryAsCommandGroup(data.path, data.name, {
                        category: categoryOptions.category,
                        categoryLocalizations: categoryOptions.categoryLocalizations,
                    })
                );
            }
        }

        return options.map(option => Object.assign(option, categoryOptions));
    }

    private async _loadCommandsFromFile(filePath: string) {
        const data = getModuleData(filePath, true);
        const contents = data && (await loadModule(data));
        if (!contents) return [];

        const object = flattenTree(contents, '/');
        const commands = Object.values(object);

        return (
            [contents, ...commands]
                .filter(this._extendsCommand)
                // @ts-expect-error Access abstract class
                .map(command => new command(this.container))
                .filter(this._isCommand)
        );
    }

    private async _loadDirectoryIndex<O = Command.CategoryOptions | Command.GroupOptions>(
        folderPath: string
    ): Promise<O> {
        const indexPath = resolveDirectoryIndexPath(folderPath);
        if (!indexPath) return {} as any;

        const data = getModuleData(indexPath, true);
        const contents = data && (await loadModule(data));
        if (!contents) return {} as any;

        return { ...contents, ...contents.default };
    }

    private _filterByKind(
        commands: Command<any, any>[],
        kinds: Command.Kind[]
    ): Command<any, any>[] {
        return commands.filter(command => {
            if (command._variety === Command.Variety.Group) {
                const options = command.options as Command<any, any>[];
                return this._filterByKind(options, kinds).length > 0;
            } else if (command._variety === Command.Variety.Command) {
                return command.kinds.some((kind: Command.Kind) => kinds.includes(kind));
            } else return true;
        });
    }

    private _isCommand(value: unknown): value is Command<any, any> {
        return value instanceof Command;
    }

    private _isChatInputCommand(value: unknown): value is Command<Command.Type.ChatInput, any> {
        return value instanceof Command && value.type === Command.Type.ChatInput;
    }

    private _isContextMenuCommand(value: unknown): value is Command<Command.Type.ContextMenu, any> {
        return value instanceof Command && value.type === Command.Type.ContextMenu;
    }

    private _extendsCommand(value: unknown): value is typeof Command {
        return typeof value === 'function' && value.prototype instanceof Command;
    }
}
