import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

// NOTE: This list has a lot of endpoints with the need for so many different interfaces, I can't be asked to support them right now

export class InfinityBotList
    extends List
    implements List.WithStatisticsPosting, List.WithBotFetching, List.WithHasVotedFetching
{
    public readonly key = 'infinitybotlist' as const;
    public readonly title = 'Infinity Bot List' as const;
    public readonly logoUrl = 'https://i.imgur.com/x0LCfAh.png' as const;
    public readonly websiteUrl = 'https://infinitybotlist.com' as const;
    public readonly apiUrl = 'https://api.infinitybotlist.com' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', '/bots/stats', {
                    body: { servers: options.guildCount, user_count: options.userCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public async getBot(id: string) {
        return this._performRequest<InfinityBotList.IncomingBot>('GET', `/bots/${id}`) //
            .then(this._constructBot);
    }

    public async hasVoted(id: string) {
        return this._performRequest<{ has_voted: Boolean; last_vote_time: number }>(
            'GET',
            `/users/${id}/bots/${this.clientId}/votes`,
            { requiresApiToken: true }
        ).then(
            ({ has_voted, last_vote_time }) => has_voted && last_vote_time > Date.now() - 43_200_000
        );
    }

    private _constructBot<R extends InfinityBotList.IncomingBot>(raw: R) {
        return {
            id: raw.bot_id,
            username: raw.user.username,
            discriminator: raw.user.discriminator,
            avatarUrl: raw.user.avatar,
            inviteUrl: raw.invite,
            supportUrl:
                raw.extra_links.find(link => link.name.toLowerCase() === 'support')?.value ??
                undefined,
            websiteUrl:
                raw.extra_links.find(link => link.name.toLowerCase() === 'website')?.value ??
                undefined,
            shortDescription: raw.short,
            longDescription: raw.long,
            raw,
        } satisfies List.Bot<R>;
    }
}

export namespace InfinityBotList {
    export interface IncomingBot {
        /** The note for the bot's approval. */
        approval_note: string | null;
        /** The bot's banner URL if it has one, otherwise null. */
        banner: string | null;
        /** The bot's ID. */
        bot_id: string;
        /** Whether the bot should have captchas shown if the user has captcha_sponsor_enabled. */
        captcha_opt_out: boolean;
        /** The reason for the bot being certified. */
        cert_reason: string | null;
        /** The user who claimed the bot. */
        claimed_by: string | null;
        /** The bot's total click count. */
        clicks: number;
        /** The bot's associated client ID validated using that top-secret Oauth2 API! Used in anti-abuse measures.. */
        client_id: string;
        /** The bot's creation date. */
        created_at: string;
        /** The bot's links that it wishes to advertise. */
        extra_links: {
            /** Name of the link. Links starting with an underscore are 'asset links' and are not visible. */
            name: string;
            /** Value of the link. Must normally be HTTPS with the exception of 'asset links'. */
            value: string;
        }[];
        /** The bot's invite URL. Must be present. */
        invite: string;
        /** The bot's invite click count (via users inviting the bot from IBL). */
        invite_clicks: number;
        /** The bot's internal ID. An artifact of database migrations. */
        itag: string;
        /** The bot's last claimed date. */
        last_claimed: string;
        /** The bot's library. */
        library: string;
        /** The bot's long description in raw format (HTML/markdown etc. based on the bots settings). */
        long: string;
        /** Whether the bot is NSFW or not. */
        nsfw: boolean;
        /** The bot owner's user information. If in a team, this will be null and team_owner will instead be set. */
        owner: {
            /** The users ID. */
            id: string;
            /** The users username. */
            username: string;
            /** The users discriminator. */
            discriminator: string;
            /** The users resolved avatar URL (not just hash). */
            avatar: string;
            /** Whether the user is a bot or not. */
            bot: boolean;
            /** The guild (ID) the user is in if in a mutual server. */
            in_guild?: string;
            /** The users nickname if in a mutual server. */
            nickname?: string;
            /** The users current status. */
            status: string;
        } | null;
        /** The bot's prefix. */
        prefix: string;
        /** Whether the bot is a premium bot or not. */
        premium: boolean;
        /** The period of premium for the bot. */
        premium_period_length: {
            /** Duration of the interval in nanoseconds.*/
            duration: number;
            /** Duration of the interval in seconds. */
            secs: number;
            /** String representation of the interval. */
            string: string;
        };
        /** The bot's queue name if it has one, otherwise null. */
        queue_avatar: string | null;
        /** The bot's queue name if it has one, otherwise null. */
        queue_name: string;
        /** The bot's server count. */
        servers: number;
        /** The number of servers per shard. */
        shard_list: number[];
        /** The bot's shard count. */
        shards: number;
        /** The bot's short description. */
        short: string;
        /** The bot's start premium period. */
        start_premium_period: string;
        /** The bot's tags (e.g. music, moderation, etc.). */
        tags: string[];
        /** If the bot is in a team, who owns the bot. If not in a team, this will be null and owner will instead be set. */
        team_owner: {
            avatar: string;
            id: string;
            members: {
                created_at: string;
                perms: string[];
                user: IncomingDiscordUser;
            }[];
            name: string;
            user_bots: {
                bot_id: string;
                clicks: number;
                invite_clicks: number;
                library: string;
                nsfw: boolean;
                premium: boolean;
                servers: number;
                shards: number;
                short: string;
                tags: string[];
                type: string;
                user: IncomingDiscordUser;
                vanity: string;
                votes: number;
            }[];
        } | null;
        /** The bot's total number of uptime checks. */
        total_uptime: number;
        /** The bot's type (e.g. pending/approved/certified/denied etc.). Note that we do not filter out denied/banned bots in API. */
        type: string;
        /** The bot's unique click count based on SHA256 hashed IPs. */
        unique_clicks: number;
        /** The bot's total number of successful uptime checks. */
        uptime: number;
        /** The bot's last uptime check. */
        uptime_last_checked: string;
        /** The bot's user information. */
        user: IncomingDiscordUser;
        /** The bot's user count */
        users: number;
        /** The bot's vanity URL if it has one, otherwise null */
        vanity: string | null;
        /** Whether the bot is vote banned or not */
        vote_banned: boolean;
        /** The bot's vote count */
        votes: number;
        /** Whether the bot is using webhooks v2 or not */
        webhooks_v2: boolean;
    }

    export interface IncomingDiscordUser {
        /** The users ID. */
        id: string;
        /** The users username. */
        username: string;
        /** The users discriminator. */
        discriminator: string;
        /** The users resolved avatar URL (not just hash). */
        avatar: string;
        /** Whether the user is a bot or not. */
        bot: boolean;
        /** The users current status. */
        status: string;
        /** The guild (ID) the user is in if in a mutual server. */
        in_guild: string;
        /** The users nickname if in a mutual server */
        nickname: string;
    }
}
