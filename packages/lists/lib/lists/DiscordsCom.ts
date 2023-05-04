import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordsCom
    extends List
    implements
        List.WithStatisticsPosting,
        List.WithBotFetching,
        List.WithUserBotsFetching,
        List.WithUserFetching
{
    public readonly key = 'discordscom' as const;
    public readonly title = 'Discords.com' as const;
    public readonly logoUrl = 'https://discords.com/bots/img/manifest/icon-512x512.png' as const;
    public readonly websiteUrl = 'https://discords.com/bots' as const;
    public readonly apiUrl = 'https://discords.com/bots/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bot/${this.clientId}`, {
                    body: { server_count: options.guildCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public async getBot(id: string) {
        return this._performRequest<DiscordsCom.IncomingBot>('GET', `/bot/${id}`) //
            .then(this._constructBot);
    }

    public async getUserBots(id: string) {
        return this._performRequest<{ bots: string[] }>('GET', `/user/${id}/bots`) //
            .then(({ bots }) => Promise.all(bots.map(id => this.getBot(id))));
    }

    public async getUser(id: string) {
        return this._performRequest<DiscordsCom.IncomingUser>('GET', `/user/${id}`) //
            .then(this._constructUser);
    }

    private _constructBot<R extends DiscordsCom.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.name,
            discriminator: raw.tag.split('#')[1],
            avatarUrl: raw.avatar,
            inviteUrl: raw.invite,
            supportUrl: raw.support_server || undefined,
            websiteUrl: raw.website || undefined,
            shortDescription: raw.short_desc,
            longDescription: '' as const,
            raw,
        } satisfies List.Bot<R>;
    }

    private _constructUser<R extends DiscordsCom.IncomingUser>(raw: R) {
        return {
            id: raw.id,
            username: raw.username,
            discriminator: raw.tag.split('#')[1],
            avatarUrl: raw.avatar,
            raw,
        } satisfies List.User<R>;
    }
}

export namespace DiscordsCom {
    export interface IncomingBot {
        /** The timestamp representing when the bot was added. */
        added: number;
        /** Indicates if the bot has been approved. */
        approved: boolean;
        /** The timestamp representing when the bot was approved. */
        approvedTime: number;
        /** The avatar hash of the bot. */
        avatar: string;
        /** The color of the bot's profile. */
        color: string;
        /** The discriminator of the bot. */
        discrim: string;
        /** Indicates if the bot is featured on the website. */
        featured: boolean;
        /** The GitHub repository URL of the bot. */
        github: string;
        /** The ID of the bot. */
        id: string;
        /** The invite URL of the bot. */
        invite: string;
        /** The library used by the bot. */
        library: string;
        /** The name of the bot. */
        name: string;
        /** Indicates if the bot is NSFW. */
        nsfw: boolean;
        /** The ID of the bot's owner. */
        owner: string;
        /** An array of owner IDs. */
        owners: string[];
        /** Indicates if the bot is a partner. */
        partner: boolean;
        /** The prefix used by the bot. */
        prefix: string;
        /** The number of servers the bot is in. */
        server_count: number;
        /** A short description of the bot. */
        short_desc: string;
        /** The status of the bot. */
        status: string;
        /** The support server URL of the bot. */
        support_server: string;
        /** The tag of the bot. */
        tag: string;
        /** An array of tags associated with the bot. */
        tags: string[];
        /** The vanity URL of the bot. */
        vanityUrl: string;
        /** Indicates if the bot is verified. */
        verified: boolean;
        /** The number of votes the bot has received. */
        votes: number;
        /** The number of votes the bot has received in the last 24 hours. */
        votes24: number;
        /** The number of votes the bot has received in the last month. */
        votesMonth: number;
        /** The website URL of the bot. */
        website: string;
        /** Indicates if the website is for the bot only. */
        website_bot: boolean;
    }

    export interface IncomingUser {
        /** The user's avatar URL. */
        avatar: string;
        /** The user's background URL. */
        background: string;
        /** The user's biography. */
        bio: string;
        /** Whether the user is contributing to the COVID-19 relief fund. */
        covidFund: boolean;
        /** The user's discriminator. */
        discrim: string;
        /** The user's flags. */
        flags: number;
        /** The user's house. */
        house: string;
        /** The user's ID. */
        id: string;
        /** Whether the user is an administrator. */
        isAdmin: boolean;
        /** Whether the user is part of the beta program. */
        isBeta: boolean;
        /** Whether the user is a junior moderator. */
        isJrMod: boolean;
        /** Whether the user is a moderator. */
        isMod: boolean;
        /** Whether the user is a Discord partner. */
        isPartner: boolean;
        /** The user's status message. */
        status: string;
        /** The user's tag. */
        tag: string;
        /** Whether the user has donated to Team Trees. */
        teamTrees: boolean;
        /** The user's username. */
        username: string;
        /** The user's website. */
        website: string;
    }
}
