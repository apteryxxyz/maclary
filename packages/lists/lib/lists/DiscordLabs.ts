import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordLabs extends List {
    public readonly key = 'discordbotlist' as const;
    public readonly title = 'Discord Labs' as const;
    public readonly logoUrl = 'https://avatars2.githubusercontent.com/u/54491479?v=4' as const;
    public readonly websiteUrl = 'https://bots.discordlabs.org' as const;
    public readonly apiUrl = 'https://bots.discordlabs.org/v2' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}/stats`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
        });
    }
}
