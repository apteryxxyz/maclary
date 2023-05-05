import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordBotList
    extends List
    implements List.WithStatisticsPosting, List.WithHasVotedFetching
{
    public readonly key = 'discordbotlist' as const;
    public readonly title = 'Discord Bot List' as const;
    public readonly logoUrl = 'https://discordbotlist.com/android-icon-192x192.png' as const;
    public readonly websiteUrl = 'https://discordbotlist.com' as const;
    public readonly apiUrl = 'https://discordbotlist.com/api/v1' as const;

    protected override _formatApiToken() {
        return `Bot ${this.apiToken}`;
    }

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}/stats`, {
                    body: {
                        guilds: options.guildCount,
                        users: options.userCount,
                        voice_connections: options.voiceConnectionCount,
                    },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public hasVoted(id: string) {
        return this._performRequest<{ upvotes: { user_id: string; timestamp: string }[] }>(
            'GET',
            `/bots/${this.clientId}/upvotes`,
            { requiresApiToken: true }
        ).then(({ upvotes }) =>
            upvotes.some(
                upvote =>
                    upvote.user_id === id &&
                    new Date(upvote.timestamp) > new Date(Date.now() - 43_200_000)
            )
        );
    }
}
