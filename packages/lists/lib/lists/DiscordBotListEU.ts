import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordBotListEU extends List {
    public readonly key = 'discordbotlisteu' as const;
    public readonly title = 'discord-botlist.eu' as const;
    public readonly logoUrl = 'https://cdn.discord-botlist.eu/pictures/logo.png' as const;
    public readonly websiteUrl = 'https://discord-botlist.eu' as const;
    public readonly apiUrl = 'https://api.discord-botlist.eu/v1' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/update`, {
            body: { count: options.guildCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }

    protected override _formatApiToken() {
        return `Bearer ${this.apiToken}`;
    }
}
