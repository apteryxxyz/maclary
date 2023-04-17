import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordsCom extends List {
    public readonly key = 'discordscom' as const;
    public readonly title = 'Discords.com' as const;
    public readonly logoUrl = 'https://discords.com/bots/img/manifest/icon-512x512.png' as const;
    public readonly websiteUrl = 'https://discords.com/bots' as const;
    public readonly apiUrl = 'https://discords.com/bots/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('PUT', `/bots/${this.clientId}/guilds`, {
            body: { count: options.guildCount },
            requiresApiToken: true,
        });
    }
}
