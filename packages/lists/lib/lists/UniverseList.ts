import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class UniverseList extends List {
    public readonly key = 'universelist' as const;
    public readonly title = 'Universe List' as const;
    public readonly logoUrl = 'https://i.imgur.com/VOVfYV7.png' as const;
    public readonly websiteUrl = 'https://universe-list.xyz' as const;
    public readonly apiUrl = 'https://universe-list.xyz/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
