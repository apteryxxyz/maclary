import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordExtremeList
    extends List
    implements List.WithStatisticsPosting, List.WithServerFetching, List.WithUserFetching
{
    public readonly key = 'discordextremelist' as const;
    public readonly title = 'Discord Extreme List' as const;
    public readonly logoUrl = 'https://get.snaz.in/4KjWg91.png' as const;
    public readonly websiteUrl = 'https://discordextremelist.xyz' as const;
    public readonly apiUrl = 'https://api.discordextremelist.xyz/v2' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/${this.clientId}/stats`, {
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
        return this._performRequest<DiscordExtremeList.IncomingBot>('GET', `/bot/${id}`) //
            .then(this._constructBot);
    }

    public getServer(id: string) {
        return this._performRequest<DiscordExtremeList.IncomingServer>('GET', `/server/${id}`) //
            .then(this._constructServer);
    }

    public getUser(id: string) {
        return this._performRequest<DiscordExtremeList.IncomingUser>('GET', `/user/${id}`) //
            .then(this._constructUser);
    }

    private _constructBot<R extends DiscordExtremeList.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.name,
            // List doesn't provide a discriminator, just use an empty string
            discriminator: '' as const,
            avatarUrl: raw.avatar.url,
            inviteUrl: raw.links.invite,
            supportUrl: raw.links.support || undefined,
            websiteUrl: raw.links.website || undefined,
            shortDescription: raw.shortDesc,
            longDescription: raw.longDesc,
            raw,
        } satisfies List.Bot<R>;
    }

    private _constructServer<R extends DiscordExtremeList.IncomingServer>(raw: R) {
        return {
            id: raw.id,
            name: raw.name,
            iconUrl: raw.icon.url,
            shortDescription: raw.shortDesc,
            longDescription: raw.longDesc,
            raw,
        } satisfies List.Server<R>;
    }

    private _constructUser<R extends DiscordExtremeList.IncomingUser>(raw: R) {
        return {
            id: raw.id,
            username: raw.name,
            discriminator: raw.fullUsername.split('#')[1],
            avatarUrl: raw.avatar.url,
            raw,
        } satisfies List.User<R>;
    }
}

export namespace DiscordExtremeList {
    export interface IncomingBot {
        /** The ID of the bot. */
        id: string;
        /** The name of the bot. */
        name: string;
        /** The prefix used for the bot's commands. */
        prefix: string;
        /** An array of tags describing the bot. */
        tags: string[];
        /** The bot's vanity URL. */
        vanityUrl: string;
        /** The number of servers the bot is in. */
        serverCount: number;
        /** The number of shards the bot is running on. */
        shardCount: number;
        /** A short description of the bot. */
        shortDesc: string;
        /** A longer description of the bot. */
        longDesc: string;
        /** An array of the bot's editors. */
        editors: unknown[];
        /** The user who owns the bot. */
        owner: {
            /** The ID of the user who owns the bot. */
            id: string;
        };
        /** The bot's avatar. */
        avatar: {
            /** The hash of the bot's avatar. */
            hash: string;
            /** The URL of the bot's avatar. */
            url: string;
        };
        /** Links related to the bot. */
        links: {
            /** The link to invite the bot to a server. */
            invite: string;
            /** The link to the bot's support server. */
            support: string;
            /** The link to the bot's website. */
            website: string;
            /** The link to donate to the bot. */
            donation: string;
            /** The link to the bot's repository. */
            repo: string;
        };
        /** The bot's status on Discord. */
        status: {
            /** Whether the bot has been approved. */
            approved: boolean;
            /** Whether the bot is a site bot. */
            siteBot: boolean;
            /** Whether the bot has been archived. */
            archived: boolean;
        };
    }

    export interface IncomingServer {
        /** The ID of the server. */
        id: string;
        /** The name of the server. */
        name: string;
        /** A short description of the server. */
        shortDesc: string;
        /** A long description of the server. */
        longDesc: string;
        /** An array of tags associated with the server. */
        tags: string[];
        /** The owner of the server. */
        owner: {
            /** The ID of the owner. */
            id: string;
        };
        /** The icon of the server. */
        icon: {
            /** The hash of the icon. */
            hash: string;
            /** The URL of the icon. */
            url: string;
        };
        /** The links associated with the server. */
        links: {
            /** The website link of the server. */
            website: string;
            /** The donation link of the server. */
            donation: string;
        };
    }

    export interface IncomingUser {
        /** The user's unique identifier. */
        id: string;
        /** The user's name. */
        name: string;
        /** The user's discriminator. */
        discrim: string;
        /** The user's full username, including name and discriminator. */
        fullUsername: string;
        /** The user's avatar. */
        avatar: {
            /** The hash of the user's avatar. */
            hash: string;
            /** The URL of the user's avatar. */
            url: string;
        };
        /** The user's profile. */
        profile: {
            /** The user's biography. */
            bio: string;
            /** The user's social media links. */
            links: {
                /** The user's website URL. */
                website: string;
                /** The user's GitHub URL. */
                github: string;
                /** The user's GitLab URL. */
                gitlab: string;
                /** The user's Twitter URL. */
                twitter: string;
                /** The user's Instagram URL. */
                instagram: string;
                /** The user's Snapchat URL. */
                snapchat: string;
            };
        };
        /** The user's game data. */
        game: {
            /** The user's score in the "Snakes" game. */
            snakes: {
                /** The user's maximum score in the "Snakes" game. */
                maxScore: number;
            };
        };
        /** The user's rank data. */
        rank: {
            /** Whether the user has admin privileges. */
            admin: boolean;
            /** Whether the user is an assistant. */
            assistant: boolean;
            /** Whether the user is a moderator. */
            mod: boolean;
            /** Whether the user is a tester. */
            tester: boolean;
            /** Whether the user is a translator. */
            translator: boolean;
            /** Whether the user is a COVID idk. */
            covid: boolean;
        };
    }
}
