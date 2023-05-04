import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class TopGG
    extends List
    implements List.WithStatisticsPosting, List.WithBotFetching, List.WithUserFetching
{
    public readonly key = 'topgg' as const;
    public readonly title = 'Top.gg' as const;
    public readonly logoUrl = 'https://top.gg/images/dblnew.png' as const;
    public readonly websiteUrl = 'https://top.gg' as const;
    public readonly apiUrl = 'https://top.gg/api' as const;

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

    public async getBot(id: string) {
        return this._performRequest<TopGG.IncomingBot>('GET', `/bots/${id}`) //
            .then(this._constructBot);
    }

    public async getUser(id: string) {
        return this._performRequest<TopGG.IncomingUser>('GET', `/users/${id}`) //
            .then(this._constructUser);
    }

    private _constructBot<R extends TopGG.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.username,
            discriminator: raw.discriminator,
            avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${
                raw.avatar ?? raw.defAvatar
            }`,
            inviteUrl:
                raw.invite ?? `https://discord.com/oauth2/authorize?client_id=${raw.id}&scope=bot`,
            supportUrl: raw.support ? `https://discord.gg/${raw.support}` : undefined,
            websiteUrl: raw.website,
            shortDescription: raw.shortdesc,
            longDescription: raw.longdesc ?? '',
            raw,
        } satisfies List.Bot<R>;
    }

    private _constructUser<R extends TopGG.IncomingUser>(raw: R) {
        return {
            id: raw.id,
            username: raw.username,
            discriminator: raw.discriminator,
            avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${
                raw.avatar ?? raw.defAvatar
            }`,
            raw,
        } satisfies List.User<R>;
    }
}

export namespace TopGG {
    export interface IncomingBot {
        /** The id of the bot. */
        id: string;
        /** The username of the bot. */
        username: string;
        /** The discriminator of the bot. */
        discriminator: string;
        /** The avatar hash of the bot's avatar. */
        avatar?: string;
        /** The cdn hash of the bot's avatar if the bot has none. */
        defAvatar: string;
        /** The library of the bot. */
        lib: string;
        /** The prefix of the bot. */
        prefix: string;
        /** The short description of the bot. */
        shortdesc: string;
        /** The long description of the bot. Can contain HTML and/or Markdown. */
        longdesc?: string;
        /** The tags of the bot. */
        tags: string[];
        /** The website url of the bot. */
        website?: string;
        /** The support server invite code of the bot. */
        support?: string;
        /** The link to the github repo of the bot. */
        github?: string;
        /** The owners of the bot. First one in the array is the main owner. */
        owners: string[];
        /** The guilds featured on the bot page. */
        guilds: string[];
        /** The custom bot invite url of the bot. */
        invite?: string;
        /** The date when the bot was approved. */
        date: string;
        /** The amount of servers the bot has according to posted stats.. */
        server_count?: number;
        /** The amount of shards the bot has according to posted stats.. */
        shard_count?: number;
        /** The certified status of the bot. */
        certifiedBot: boolean;
        /** The vanity url of the bot. */
        vanity?: string;
        /** The amount of upvotes the bot has. */
        points: number;
        /** The amount of upvotes the bot has this month. */
        monthlyPoints: number;
        /** The guild id for the donatebot setup. */
        donatebotguildid: string;
    }

    export interface IncomingUser {
        /** The id of the user. */
        id: string;
        /** The username of the user. */
        username: string;
        /** The discriminator of the user. */
        discriminator: string;
        /** The avatar hash of the user's avatar. */
        avatar?: string;
        /** The cdn hash of the user's avatar if the user has none. */
        defAvatar: string;
        /** The bio of the user. */
        bio?: string;
        /** The banner image url of the user. */
        banner?: string;
        /** The social usernames of the user. */
        social: {
            /** The youtube channel id of the user. */
            youtube?: string;
            /** The reddit username of the user. */
            reddit?: string;
            /** The twitter username of the user. */
            twitter?: string;
            /** The instagram username of the user. */
            instagram?: string;
            /** The github username of the user. */
            github?: string;
        };
        /** The custom hex color of the user (not guaranteed to be valid hex). */
        color?: string;
        /** The supporter status of the user. */
        supporter: boolean;
        /** The certified status of the user. */
        certifiedDev: boolean;
        /** The mod status of the user. */
        mod: boolean;
        /** The website moderator status of the user. */
        webMod: boolean;
        /** The admin status of the user. */
        admin: boolean;
    }
}
