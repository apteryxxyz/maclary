import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordList extends List implements List.WithStatisticsPosting {
    public readonly key = 'discordlist' as const;
    public readonly title = 'Discordlist' as const;
    public readonly logoUrl = 'https://avatars.githubusercontent.com/u/68995595' as const;
    public readonly websiteUrl = 'https://discordlist.gg' as const;
    public readonly apiUrl = 'https://api.discordlist.gg/v0' as const;

    protected override _formatApiToken() {
        return `Bearer ${this.apiToken}`;
    }

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('PUT', `/bot/${this.clientId}/guilds`, {
                    body: { count: options.guildCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }
}
