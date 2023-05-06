import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class UniverseList
    extends List
    implements
        List.WithStatisticsPosting,
        List.WithBotFetching,
        List.WithServerFetching,
        List.WithHasVotedFetching
{
    public readonly key = 'universelist' as const;
    public readonly title = 'Universe List' as const;
    public readonly logoUrl = 'https://i.imgur.com/VOVfYV7.png' as const;
    public readonly websiteUrl = 'https://universe-list.xyz' as const;
    public readonly apiUrl = 'https://universe-list.xyz/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}`, {
                    body: { server_count: options.guildCount, shard_count: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public async getBot(id: string) {
        return this._performRequest<UniverseList.IncomingBot>('GET', `/bots/${id}`) //
            .then(this._constructBot);
    }

    public async getServer(id: string) {
        return this._performRequest<UniverseList.IncomingServer>('GET', `/servers/${id}`) //
            .then(this._constructServer);
    }

    public async hasVoted(id: string) {
        return this._performRequest<{ voted: boolean; current: number }>(
            'GET',
            `/bots/${this.clientId}/voted`,
            { query: { user: id }, requiresApiToken: true }
        ).then(({ voted, current }) => voted && current > Date.now() - 43_200_000);
    }

    private _constructBot<R extends UniverseList.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.username,
            discriminator: raw.discriminator,
            avatarUrl: raw.avatar,
            inviteUrl: raw.invite,
            supportUrl: raw.support || undefined,
            websiteUrl: raw.website || undefined,
            shortDescription: raw.shortDescription,
            longDescription: raw.description,
            raw,
        } satisfies List.Bot<R>;
    }

    private _constructServer<R extends UniverseList.IncomingServer>(raw: R) {
        return {
            id: raw.id,
            name: raw.name,
            iconUrl: raw.icon,
            inviteUrl: raw.invite,
            shortDescription: raw.shortDesc,
            longDescription: raw.description,
            raw,
        } satisfies List.Server<R>;
    }
}

export namespace UniverseList {
    export interface IncomingBot {
        /** The ID of the targeted bot. */
        id: string;
        /** The username of the targeted bot. */
        username: string;
        /** The discriminator of the targeted bot. */
        discriminator: string;
        /** The avatar URL of the targeted bot. */
        avatar: string;
        /** The prefix of the targeted bot. */
        prefix: string;
        /** The ID of the targeted bot's owner. */
        owner: string;
        /** The tag of the targeted bot's owner. */
        ownerTag: string;
        /** An array of the targeted bot's tags. */
        tags: string[];
        /** The amount of views the targeted bot's page has gotten. */
        views: number;
        /** The date the targeted bot was submitted to Universe List. */
        submittedOn: string;
        /** The date the targeted bot was approved on Universe List. */
        approvedOn: string;
        /** The short description of the targeted bot on Universe List. */
        shortDescription: string;
        /** The description of the targeted bot on Universe List. */
        description: string;
        /** The number of shards the targeted bot has. */
        shards: string;
        /** The number of servers the targeted bot has. */
        servers: number;
        /** The number of votes the targeted bot has on Universe List. */
        votes: number;
        /** The invite of the targeted bot. */
        invite: string;
        /** The website of the targeted bot. */
        website: string;
        /** The GitHub of the targeted bot. */
        github: string;
        /** The support server of the targeted bot. */
        support: string;
    }

    export interface IncomingServer {
        /** The name of the targeted server. */
        name: string;
        /** The ID of the targeted server. */
        id: string;
        /** The member count of the targeted server. */
        members: number;
        /** The icon URL of the targeted server. */
        icon: string;
        /** The invite URL of the targeted server. */
        invite: string;
        /** The submitted date of the targeted server. */
        submittedOn: string;
        /** The website URL of the targeted server. */
        website: string;
        /** The owner ID of the targeted server. */
        owner: string;
        /** The owner tag of the targeted server. */
        ownerTag: string;
        /** All of the tags of the targeted server. */
        tags: string[];
        /** The latest bump date of the targeted server. */
        bump: Date;
        /** The number of bumps of the targeted server. */
        bumps: number;
        /** The number of views of the targeted server. */
        views: number;
        /** The number of votes of the targeted server. */
        votes: number;
        /** The short description of the targeted server. */
        shortDesc: string;
        /** The description of the targeted server. */
        description: string;
    }
}
