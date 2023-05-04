import { List } from '~/structures/List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class BotsOnDiscord extends List implements List.WithStatisticsPosting {
    public readonly key = 'botsondiscord' as const;
    public readonly title = 'Bots on Discord' as const;
    public readonly logoUrl =
        'https://bots.ondiscord.xyz/favicon/android-chrome-256x256.png' as const;
    public readonly websiteUrl = 'https://bots.ondiscord.xyz' as const;
    public readonly apiUrl = 'https://bots.ondiscord.xyz/bot-api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await Utilities.executePromiseWithEvents(
            () =>
                this._performRequest('POST', `/bots/${this.clientId}/guilds`, {
                    body: { guildCount: options.guildCount },
                    requiresApiToken: true,
                }),
            this,
            List.Events.StatisticsPostingSuccess,
            List.Events.StatisticsPostingFailure,
            [options]
        );
    }
}
