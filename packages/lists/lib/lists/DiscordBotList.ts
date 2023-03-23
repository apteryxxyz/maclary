import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class DiscordBotList extends List {
    public readonly key = 'discordbotlist' as const;
    public readonly title = 'Discord Bot List' as const;
    public readonly logoUrl = 'https://discordbotlist.com/android-icon-192x192.png' as const;
    public readonly websiteUrl = 'https://discordbotlist.com' as const;
    public readonly apiUrl = 'https://discordbotlist.com/api/v1' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}/stats`, {
            body: {
                guilds: options.guildCount,
                users: options.userCount,
                voice_connections: options.voiceConnectionCount,
            },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }

    protected override _formatApiToken() {
        return `Bot ${this.apiToken}`;
    }
}
