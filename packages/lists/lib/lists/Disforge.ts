import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class Disforge extends List implements List.WithStatisticsPosting {
    public readonly key = 'disforge' as const;
    public readonly title = 'Disforge' as const;
    public readonly logoUrl = 'https://disforge.com/assets/img/ui/categories/all-bots.png' as const;
    public readonly websiteUrl = 'https://disforge.com/bots' as const;
    public readonly apiUrl = 'https://disforge.com/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/botstats/${this.clientId}`, {
                    body: { servers: options.guildCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    // NOTE: Tried to implement hasVoted but couldn't figure out the return structure
}
