import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class BotsOnDiscord extends List {
    public readonly key = 'botsondiscord' as const;
    public readonly title = 'Bots on Discord' as const;
    public readonly logoUrl =
        'https://bots.ondiscord.xyz/favicon/android-chrome-256x256.png' as const;
    public readonly websiteUrl = 'https://bots.ondiscord.xyz' as const;
    public readonly apiUrl = 'https://bots.ondiscord.xyz/bot-api' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}/guilds`, {
            body: { guildCount: options.guildCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
