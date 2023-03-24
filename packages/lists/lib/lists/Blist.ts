import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class Blist extends List {
    public readonly key = 'blist' as const;
    public readonly title = 'Blist' as const;
    public readonly logoUrl =
        'https://blist.xyz/main_site/staticfiles/main/assets/blist.png' as const;
    public readonly websiteUrl = 'https://blist.xyz' as const;
    public readonly apiUrl = 'https://blist.xyz/api/v2' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('PATCH', `/bot/${this.clientId}/stats`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
