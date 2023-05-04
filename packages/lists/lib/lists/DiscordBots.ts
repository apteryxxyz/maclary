import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordBots
    extends List
    implements List.WithStatisticsPosting, List.WithBotFetching, List.WithUserBotsFetching
{
    public readonly key = 'discordbots' as const;
    public readonly title = 'Discord Bots' as const;
    public readonly logoUrl =
        'https://pbs.twimg.com/profile_images/1071582837030060032/kKV-I01n_400x400.jpg' as const;
    public readonly websiteUrl = 'https://discord.bots.gg' as const;
    public readonly apiUrl = 'https://discord.bots.gg/api/v1' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}/stats`, {
                    body: { guildCount: options.guildCount, shardCount: options.shardCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public getBot(id: string) {
        return this._performRequest<DiscordBots.IncomingBot>('GET', `/bots/${id}`) //
            .then(this._constructBot);
    }

    public getUserBots(id: string) {
        return this._performRequest<{ bots: DiscordBots.IncomingBot[] }>(
            'GET',
            `/bots`, //
            { query: { authorID: id, limit: 100 } }
        ) //
            .then(({ bots }) => bots.map(this._constructBot));
    }

    private _constructBot<R extends DiscordBots.IncomingBot>(raw: R) {
        return {
            id: raw.clientId,
            username: raw.username,
            discriminator: raw.discriminator,
            avatarUrl: raw.avatarURL,
            inviteUrl: raw.botInvite,
            supportUrl: raw.supportInvite ?? undefined,
            websiteUrl: raw.website ?? undefined,
            shortDescription: raw.shortDescription,
            longDescription: raw.longDescription,
            raw,
        } satisfies List.Bot<R>;
    }
}

export namespace DiscordBots {
    export interface IncomingBot {
        /** The user ID of the bot. */
        userId: string;
        /** The client ID of the bot. */
        clientId: string;
        /** The username of the bot. */
        username: string;
        /** The discriminator of the bot. */
        discriminator: string;
        /** The URL of the bot's avatar. */
        avatarURL: string;
        /** An array of co-owners for the bot. */
        coOwners: string[];
        /** The prefix used for commands. */
        prefix: string;
        /** The command used to display help information. */
        helpCommand: string;
        /** The name of the library the bot uses. */
        libraryName: string;
        /** The URL of the bot's website. */
        website: string | null;
        /** The invite link to join the bot support server. */
        supportInvite: string | null;
        /** The invite link to add the bot to a server. */
        botInvite: string;
        /** A short description of the bot. */
        shortDescription: string;
        /** A long description of the bot. */
        longDescription: string;
        /** The link to the bot's open source repository. */
        openSource: string | null;
        /** The number of shards the bot is using. */
        shardCount: number;
        /** The number of servers the bot is in. */
        guildCount: number;
        /** Whether or not the bot is verified. */
        verified: boolean;
        /** Whether or not the bot is currently online. */
        online: boolean;
        /** Whether or not the bot is in a server. */
        inGuild: boolean;
        /** Information about the owner of the bot. */
        owner: {
            /** The username of the bot owner. */
            username: string;
            /** The discriminator of the bot owner. */
            discriminator: string;
            /** The user ID of the bot owner. */
            userId: string;
        };
        /** The date the bot was added to Discord Bots. */
        addedDate: string;
        /** The current status of the bot. */
        status: 'online' | 'idle' | 'dnd' | 'offline';
    }
}
