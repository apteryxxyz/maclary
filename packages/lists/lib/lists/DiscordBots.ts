import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordBots extends List {
    public readonly key = 'discordbots' as const;
    public readonly title = 'Discord Bots' as const;
    public readonly logoUrl =
        'https://pbs.twimg.com/profile_images/1071582837030060032/kKV-I01n_400x400.jpg' as const;
    public readonly websiteUrl = 'https://discord.bots.gg' as const;
    public readonly apiUrl = 'https://discord.bots.gg/api/v1' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}/stats`, {
            body: { guildCount: options.guildCount, shardCount: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
