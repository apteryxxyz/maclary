import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class BotListMe extends List {
    public readonly key = 'botlistme' as const;
    public readonly title = 'Bot List Me' as const;
    public readonly logoUrl = 'https://docs.botlist.me/icon.png' as const;
    public readonly websiteUrl = 'https://botlist.me' as const;
    public readonly apiUrl = 'https://api.botlist.me/api/v1' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}/stats`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
