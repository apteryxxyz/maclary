import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class DiscordBotListEU extends List implements List.WithStatisticsPosting {
    public readonly key = 'discordbotlisteu' as const;
    public readonly title = 'discord-botlist.eu' as const;
    public readonly logoUrl = 'https://cdn.discord-botlist.eu/pictures/logo.png' as const;
    public readonly websiteUrl = 'https://discord-botlist.eu' as const;
    public readonly apiUrl = 'https://api.discord-botlist.eu/v1' as const;

    protected override _formatApiToken() {
        return `Bearer ${this.apiToken}`;
    }

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/update`, {
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
