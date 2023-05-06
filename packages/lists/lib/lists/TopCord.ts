import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

// NOTE: Supports fetching a bot, but response doesn't have enough information to construct a bot object
// Missing username, discriminator, and avatar

export class TopCord
    extends List
    implements List.WithStatisticsPosting, List.WithWebhookVoteReceiving
{
    public readonly key = 'topcord' as const;
    public readonly title = 'TopCord' as const;
    public readonly logoUrl = 'https://topcord.xyz/icons/TopCord.png' as const;
    public readonly websiteUrl = 'https://topcord.xyz' as const;
    public readonly apiUrl = 'https://topcord.xyz' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/${this.clientId}/stats`, {
                    body: { guilds: options.guildCount, shards: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    /** @internal */ public _constructWebhookVote<R extends TopCord.IncomingWebhookVote>(raw: R) {
        return {
            type: 'vote',
            userId: raw.User.ClientID,
            raw,
        } satisfies List.WebhookVote<R>;
    }
}

export namespace TopCord {
    export interface IncomingWebhookVote {
        /** The user structure. */
        User: {
            ClientID: string;
        };
        /** The id of the bot/server. */
        ClientID: string;
        /** If the vote is for a server or bot. */
        Type: 'Bot' | 'Server';
    }
}

/*
Field	Type	Description
User	User[]	
ClientID	string	The id of the bot/server
Type	string	If the vote is for a server or bot
*/
