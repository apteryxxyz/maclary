import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class BotListMe
    extends List
    implements List.WithStatisticsPosting, List.WithHasVotedFetching, List.WithWebhookVoteReceiving
{
    public readonly key = 'botlistme' as const;
    public readonly title = 'Bot List Me' as const;
    public readonly logoUrl = 'https://docs.botlist.me/icon.png' as const;
    public readonly websiteUrl = 'https://botlist.me' as const;
    public readonly apiUrl = 'https://api.botlist.me/api/v1' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}/stats`, {
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
        return this._performRequest<{ hasVoted: boolean }>('GET', `bots/${this.clientId}/voted`, {
            query: { id },
            requiresApiToken: true,
        }).then(({ hasVoted }) => hasVoted);
    }

    /** @internal */ public _constructWebhookVote<R extends BotListMe.IncomingWebhookVote>(raw: R) {
        return {
            type: raw.type === 'Upvote' ? 'vote' : 'test',
            userId: raw.user,
            raw,
        } satisfies List.WebhookVote<R>;
    }
}

export namespace BotListMe {
    export interface IncomingWebhookVote {
        bot: string;
        user: string;
        type: 'Upvote' | 'Test';
    }
}
