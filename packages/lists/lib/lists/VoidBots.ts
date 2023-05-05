import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

// NOTE: Supports fetching a bot, but response doesn't have enough information to construct a bot object
// Missing username and discriminator

export class VoidBots
    extends List
    implements List.WithStatisticsPosting, List.WithHasVotedFetching
{
    public readonly key = 'voidbots' as const;
    public readonly title = 'Void Bots' as const;
    public readonly logoUrl = 'https://voidbots.net/assets/img/logo.png' as const;
    public readonly websiteUrl = 'https://voidbots.net' as const;
    public readonly apiUrl = 'https://api.voidbots.net' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/stats/${this.clientId}`, {
                    body: { server_count: options.guildCount, shard_count: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public hasVoted(id: string) {
        return this._performRequest<{ voted: boolean }>(
            'GET',
            `/bot/voted/${this.clientId}/${id}`,
            { requiresApiToken: true }
        ).then(({ voted }) => voted);
    }
}
