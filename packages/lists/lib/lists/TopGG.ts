import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class TopGG extends List {
    public readonly key = 'topgg' as const;
    public readonly title = 'Top.gg' as const;
    public readonly logoUrl = 'https://top.gg/images/dblnew.png' as const;
    public readonly websiteUrl = 'https://top.gg' as const;
    public readonly apiUrl = 'https://top.gg/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}/stats`, {
            body: {
                server_count: options.guildCount,
                shard_count: options.shardCount,
            },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
