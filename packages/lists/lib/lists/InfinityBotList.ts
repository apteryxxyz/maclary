import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class InfinityBotList extends List {
    public readonly key = 'infinitybotlist' as const;
    public readonly title = 'Infinity Bot List' as const;
    public readonly logoUrl = 'https://i.imgur.com/x0LCfAh.png' as const;
    public readonly websiteUrl = 'https://infinitybotlist.com' as const;
    public readonly apiUrl = 'https://api.infinitybotlist.com' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', '/bots/stats', {
            body: { servers: options.guildCount, user_count: options.userCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
