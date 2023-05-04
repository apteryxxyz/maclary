import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class YABL
    extends List
    implements List.WithStatisticsPosting, List.WithUserFetching, List.WithBotFetching
{
    public readonly key = 'yabl' as const;
    public readonly title = 'Yet Another Bot List' as const;
    public readonly logoUrl = 'https://i.imgur.com/OFiMern.png' as const;
    public readonly websiteUrl = 'https://yabl.xyz' as const;
    public readonly apiUrl = 'https://yabl.xyz/api' as const;

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
        return this._performRequest<YABL.IncomingBot>('GET', `/bots/${id}`) //
            .then(this._constructBot);
    }

    public getUser(id: string) {
        return this._performRequest<YABL.IncomingUser>('GET', `/bots/user/${id}`) //
            .then(this._constructUser);
    }

    private _constructBot<R extends YABL.IncomingBot>(raw: R) {
        return {
            id: raw.id,
            username: raw.username,
            discriminator: '' as const,
            avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar}.png`,
            inviteUrl: `https://discord.com/oauth2/authorize?client_id=${raw.id}&scope=bot`,
            supportUrl: raw.support || undefined,
            websiteUrl: raw.website || undefined,
            shortDescription: raw.desc,
            longDescription: raw.body,
            raw,
        } satisfies List.Bot<R>;
    }

    private _constructUser<R extends YABL.IncomingUser>(raw: R) {
        return {
            id: raw.id,
            username: raw.userscrim.split('#')[0],
            discriminator: raw.userscrim.split('#')[1],
            avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar}.png`,
            raw,
        } satisfies List.User<R>;
    }
}

export namespace YABL {
    export interface IncomingBot {
        _id: { $oid: string };
        id: string;
        prefix: string;
        help: string;
        desc: string;
        body: string;
        website: string;
        support: string;
        git: string | null;
        library: string;
        verified: boolean;
        owners: { [key: string]: string };
        username: string;
        avatar: string;
        guildCount?: number;
    }

    export interface IncomingUser {
        id: string;
        userscrim: string;
        avatar: string;
        bots: IncomingBot[];
    }
}
