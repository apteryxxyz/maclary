import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class VoidBots extends List {
    public readonly key = 'voidbots' as const;
    public readonly title = 'Void Bots' as const;
    public readonly logoUrl = 'https://voidbots.net/assets/img/logo.png' as const;
    public readonly websiteUrl = 'https://voidbots.net' as const;
    public readonly apiUrl = 'https://api.voidbots.net' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bot/stats/${this.clientId}`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
