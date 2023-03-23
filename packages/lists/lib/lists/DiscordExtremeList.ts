import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordExtremeList extends List {
    public readonly key = 'discordextremelist' as const;
    public readonly title = 'Discord Extreme List' as const;
    public readonly logoUrl = 'https://get.snaz.in/4KjWg91.png' as const;
    public readonly websiteUrl = 'https://discordextremelist.xyz' as const;
    public readonly apiUrl = 'https://api.discordextremelist.xyz/v2' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}/stats`, {
            body: { guildCount: options.guildCount, shardCount: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
