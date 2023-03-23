import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class WonderBots extends List {
    public readonly key = 'voidbots' as const;
    public readonly title = 'Void Bots' as const;
    public readonly logoUrl = 'https://get.snaz.in/8Jk3EJg.png' as const;
    public readonly websiteUrl = 'https://wonderbotlist.com/en' as const;
    public readonly apiUrl = 'https://api.wonderbotlist.com/v1' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/bot/${this.clientId}`, {
            body: { serveurs: options.guildCount, shard: options.shardCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
