import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordServices extends List implements List.WithStatisticsPosting {
    public readonly key = 'discordservices' as const;
    public readonly title = 'Discord Services' as const;
    public readonly logoUrl = 'https://discordservices.net/icon.png' as const;
    public readonly websiteUrl = 'https://discordservices.net' as const;
    public readonly apiUrl = 'https://api.discordservices.net' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/${this.clientId}/stats`, {
                    body: { servers: options.guildCount, shards: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }
}
