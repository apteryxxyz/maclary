import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class TopCord extends List {
    public readonly key = 'topcord' as const;
    public readonly title = 'TopCord' as const;
    public readonly logoUrl = 'https://topcord.xyz/icons/TopCord.png' as const;
    public readonly websiteUrl = 'https://topcord.xyz' as const;
    public readonly apiUrl = 'https://topcord.xyz' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}/stats`, {
            body: { guilds: options.guildCount, shards: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
