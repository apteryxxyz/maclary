import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class MotionBotList
    extends List
    implements List.WithStatisticsPosting, List.WithBotFetching
{
    public readonly key = 'motionbotlist' as const;
    public readonly title = 'Motion Botlist' as const;
    public readonly logoUrl = 'https://i.imgur.com/16NcFql.png' as const;
    public readonly websiteUrl = 'https://www.motiondevelopment.top/bot' as const;
    public readonly apiUrl = 'https://www.motiondevelopment.top/api/v1.2' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}/stats`, {
                    headers: { key: this.apiToken },
                    body: { guilds: options.guildCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }

    public getBot(id: string) {
        return this._performRequest<MotionBotList.IncomingBot>(
            'GET',
            `/bots/${id}`, //
            { headers: { key: this.apiToken } }
        ) //
            .then(this._constructBot);
    }

    private _constructBot<R extends MotionBotList.IncomingBot>(raw: R) {
        return {
            id: raw.bot_id,
            username: raw.bot_name.split('#')[0],
            discriminator: raw.bot_name.split('#')[1],
            avatarUrl: raw.avatar,
            inviteUrl: raw.invite,
            supportUrl: raw.discord || undefined,
            websiteUrl: raw.site || undefined,
            shortDescription: raw.Small_desc,
            longDescription: raw.Big_desc,
            raw,
        } satisfies List.Bot<R>;
    }
}

export namespace MotionBotList {
    export interface IncomingBot {
        /** Big Bot description. */
        Big_desc: string;
        /** Small Bot Description. */
        Small_desc: string;
        /** Bot avatar URL. */
        avatar: string;
        /** Bot ID. */
        bot_id: string;
        /** Bot name. */
        bot_name: string;
        /** Bot status. */
        bot_status: string;
        /** Array of bot's co-owners. */
        co_owners: { discriminator: string; id: string; public_flags: number; username: string }[];
        /** Discord tag for the bot. */
        discord: string;
        /** ID of the bot. */
        id: string;
        /** Invite URL for the bot. */
        invite: string;
        /** Library used to develop the bot. */
        lib: string;
        /** Date the bot was listed. */
        list_date: string;
        /** ID of the bot's owner. */
        owner_id: string;
        /** Name of the bot's owner. */
        owner_name: string;
        /** Bot prefix. */
        prefix: string;
        /** Public flags for the bot. */
        public_flags: string;
        /** Number of servers the bot is on. */
        servers: string;
        /** URL for the bot's website. */
        site: string;
        /** Approval status of the bot. */
        status: string;
        // API docs don't say what this is
        tops: unknown[];
        /** Bot username. */
        username: string;
        /** Vanity URL for the bot. */
        vanity_url: string;
    }
}
