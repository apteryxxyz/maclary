import { URL } from 'node:url';
import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class BList
    extends List
    implements
        List.WithStatisticsPosting,
        List.WithBotFetching,
        List.WithUserBotsFetching,
        List.WithServerFetching,
        List.WithUserServersFetching,
        List.WithUserFetching,
        List.WithHasVotedFetching
{
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
        });
    }

    public getBot(id: string) {
        return this._performRequest<BList.IncomingBot>('GET', `/bot/${id}`) //
            .then(this._constructBot);
    }

    public getUserBots(id: string) {
        return this._performRequest<{ bots: BList.IncomingBot[] }>('GET', `/user/${id}/bots`) //
            .then(({ bots }) => bots.map(this._constructBot));
    }

    public getServer(id: string) {
        return this._performRequest<BList.IncomingServer>('GET', `/server/${id}`) //
            .then(this._constructServer);
    }

    public getUserServers(id: string) {
        return this._performRequest<{ servers: BList.IncomingServer[] }>(
            'GET',
            `/user/${id}/servers`
        ) //
            .then(({ servers }) => servers.map(this._constructServer));
    }

    public getUser(id: string) {
        return this._performRequest<BList.IncomingUser>('GET', `/user/${id}`) //
            .then(this._constructUser);
    }

    public hasVoted(id: string) {
        return this._performRequest<{ votes: { user: string }[] }>(
            'GET',
            `/bot/${this.clientId}/votes`,
            { requiresApiToken: true }
        ).then(({ votes }) => votes.some(vote => vote.user === id));
    }

    private _constructBot<R extends BList.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.name,
            discriminator: raw.discriminator,
            avatarUrl: raw.avatar_url,
            inviteUrl: raw.invite_url,
            supportUrl: raw.support_server
                ? new URL(raw.support_server, 'https://discord.gg/').toString()
                : undefined,
            websiteUrl: raw.website || undefined,
            shortDescription: raw.short_description,
            longDescription: raw.long_description,

            raw,
        } satisfies List.Bot<R>;
    }

    private _constructServer<R extends BList.IncomingServer>(raw: R) {
        return {
            id: raw.id,
            name: raw.name,
            iconUrl: `https://cdn.discordapp.com/icons/${raw.id}/${raw.icon_hash}.png`,
            inviteUrl: raw.invite_url,
            shortDescription: raw.short_description,
            raw,
        } satisfies List.Server<R>;
    }

    private _constructUser<R extends BList.IncomingUser>(raw: R) {
        return {
            id: raw.id,
            username: raw.name,
            discriminator: raw.discriminator,
            avatarUrl: raw.avatar_url,
            raw,
        } satisfies List.User<R>;
    }
}

export namespace BList {
    export interface IncomingBot {
        /** The name of the target bot. */
        name: string;
        /** The ID of the target bot. */
        id: string;
        /** The discriminator of the target bot. */
        discriminator: string;
        /** The ID of the target bot's main owner. */
        main_owner: string;
        /** The list of ID's of the target bot's secondary owners. */
        owners: string[];
        /** The development library of the target bot. */
        library: string;
        /** The website link of the target bot. */
        website: string;
        /** The GitHub link of the target bot. */
        github: string;
        /** The short description of the target bot. */
        short_description: string;
        /** The long description of the target bot. */
        long_description: string;
        /** The command prefix of the target bot. */
        prefix: string;
        /** The invite link of the target bot which may be a discord link or custom link. */
        invite_url: string;
        /** The Discord support invite code of the target bot. */
        support_server: string;
        /** The categories of the bot. */
        tags: string[];
        /** The amount of votes the target bot has received in the current month. */
        monthly_votes: number;
        /** The amount of votes the target bot has received while on the list. */
        total_votes: number;
        /** Whether the target bot is certified. */
        certified: boolean;
        /** The target bot's vanity url. This replaces the id in the url of a bot's page. */
        vanity_url: string;
        /** The amount of servers the target bot is in. */
        server_count: number;
        /** The amount of shard processes the target bot has. */
        shard_count: number;
        /** The time and date the target bot was listed. */
        added: string;
        /** The amount of times the target bot has been invited through our list. */
        invites: number;
        /** The amount of times the target bot's page has been seen. */
        page_views: number;
        /** The link to donate to the target bot. */
        donate_url: string;
        /** The target bot's avatar url on discord. */
        avatar_url: string;
        /** The target bot's privacy policy url. */
        privacy_policy_url: string;
        /** The status of the target bot on discord (Updated every 30 minutes). */
        status: string;
        /** Whether the target bot is owned by a list staff member. */
        staff: boolean;
        /** Whether the target bot's owner paid for Blist premium. */
        premium: boolean;
    }

    export interface IncomingServer {
        /** The ID of the target server. */
        id: string;
        /** The ID of the target server's owner. */
        main_owner: string;
        /** The name of the target server. */
        name: string;
        /** The website link of the target server. */
        website: string;
        /** The short description of the target server. */
        short_description: string;
        /** The Discord invite code of the target server. */
        invite_url: string;
        /** The categories of the server. */
        tags: string[];
        /** The amount of votes the target server has received in the current month. */
        monthly_votes: number;
        /** The amount of votes the target server has received while on the list. */
        total_votes: number;
        /** The target server's vanity url. This replaces the id in the url of a server's page. */
        vanity_url: string;
        /** The amount of members the target server has. */
        member_count: number;
        /** The time and date the target server was added. */
        added: string;
        /** The amount of times the target server has been joined through our list. */
        joins: number;
        /** The amount of times the target server's page has been seen. */
        page_views: number;
        /** The link to donate to the target server. */
        donate_url: string;
        /** The link to background of the server's card. */
        card_background: string;
        /** Whether the target server's owner paid for Blist premium. */
        premium: boolean;
        /** The target server's icon on discord. */
        icon_hash: string;
        /** Whether the target server is published. */
        published: boolean;
        /** Whether the target server has been archived by itself or its owner. */
        archived: boolean;
    }

    export interface IncomingUser {
        /** The ID of the target user */
        id: string;
        /** The name of the target user */
        name: string;
        /** The discriminator of the target user */
        discriminator: string;
        /** The bio of the target user */
        bio: string;
        /** Whether the target user is a staff member */
        staff: boolean;
        /** Whether the target user is an administrator */
        administrator: boolean;
        /** Whether the target user is a bot developer */
        developer: boolean;
        /** Whether the target user is a developer of a certified bot */
        certified_developer: boolean;
        /** The time and date the target user first joined */
        joined: string;
        /** The Reddit link of the target user */
        reddit: string;
        /** The Snapchat link of the target user */
        snapchat: string;
        /** The Instagram link of the target user */
        instagram: string;
        /** The Twitter link of the target user */
        twitter: string;
        /** The GitHub link of the target user */
        github: string;
        /** The website link of the target user */
        website: string;
        /** The target user's avatar url on discord */
        avatar_url: string;
        /** Whether the target user is a Bug Hunter */
        bug_hunter: boolean;
        /** Whether the target user has been blacklisted */
        blacklisted: boolean;
        /** Whether the target user paid for Blist premium */
        premium: boolean;
        /** The target user's vanity url. This replaces the id in the url of a user's page */
        vanity_url: string;
        /** The last time the user had to use Discord OAuth to login */
        last_login: string;
    }
}
