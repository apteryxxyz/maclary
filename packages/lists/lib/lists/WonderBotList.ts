import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class WonderBotList
    extends List
    implements List.WithStatisticsPosting, List.WithBotFetching
{
    public readonly key = 'voidbots' as const;
    public readonly title = 'Void Bots' as const;
    public readonly logoUrl = 'https://get.snaz.in/8Jk3EJg.png' as const;
    public readonly websiteUrl = 'https://wonderbotlist.com/en' as const;
    public readonly apiUrl = 'https://api.wonderbotlist.com/v1' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/${this.clientId}`, {
                    body: { serveurs: options.guildCount, shard: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public getBot(id: string) {
        return this._performRequest<WonderBotList.IncomingBot>('GET', `/bot/${id}`) //
            .then(this._constructBot);
    }

    private _constructBot<R extends WonderBotList.IncomingBot>(raw: R) {
        return {
            id: String(raw.id),
            username: raw.username,
            discriminator: '' as const,
            avatarUrl: raw.avatar,
            inviteUrl: raw.invitelink,
            supportUrl: raw.supportserver ?? undefined,
            websiteUrl: raw.siteweb ?? undefined,
            shortDescription: raw.descriptcourt,
            longDescription: raw.descriptlong,
            raw,
        } satisfies List.Bot<R>;
    }
}

export namespace WonderBotList {
    export interface IncomingBot {
        /** The ID of the bot. */
        id: number;
        /** The username of the bot. */
        username: string;
        /** The ID of the bot's owner. */
        owner: string;
        /** An array of IDs of the bot's owners. */
        owners: string[];
        /** The bot's GitHub repository URL. */
        github: string | null;
        /** A short description of the bot. */
        descriptcourt: string;
        /** A longer description of the bot. */
        descriptlong: string;
        /** The URL of the bot's promotional video. */
        descriptvideo: string | null;
        /** Whether the bot has been approved by the listing site. */
        approuved: boolean;
        /** The library used to create the bot. */
        lib: string;
        /** The bot's prefix for commands. */
        prefix: string;
        /** The URL for inviting the bot to a Discord server. */
        invitelink: string;
        /** The URL of the bot's support server. */
        supportserver: string | null;
        /** The URL of the bot's website. */
        siteweb: string | null;
        /** The number of shards the bot is running. */
        shards: number;
        /** The number of servers the bot is in. */
        server: number;
        /** The number of votes the bot has received. */
        vote: number;
        /** The URL of the bot's avatar. */
        avatar: string;
        /** The languages the bot supports. */
        langue: string[];
        /** The tags assigned to the bot. */
        tags: string[];
        /** A list of changes made to the bot. */
        changelog: string[];
        /** The date the bot was added to the listing site. */
        date: {
            /** The date and time the bot was added to the listing site. */
            date: string;
            /** The type of timezone the date is in. */
            timezone_type: number;
            /** The timezone the date is in. */
            timezone: string;
        };
        /** The status of the bot on the listing site. */
        botstatus: string;
        /** The HTTP status code returned by the API. */
        status: number;
    }
}
