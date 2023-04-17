import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class YABL extends List {
    public readonly key = 'yabl' as const;
    public readonly title = 'Yet Another Bot List' as const;
    public readonly logoUrl = 'https://i.imgur.com/OFiMern.png' as const;
    public readonly websiteUrl = 'https://yabl.xyz' as const;
    public readonly apiUrl = 'https://yabl.xyz/api' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}/stats`, {
            body: { guildCount: options.guildCount },
            requiresApiToken: true,
        });
    }
}
