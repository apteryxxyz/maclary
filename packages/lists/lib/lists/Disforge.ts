import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class Disforge extends List {
    public readonly key = 'disforge' as const;
    public readonly title = 'Disforge' as const;
    public readonly logoUrl = 'https://disforge.com/assets/img/ui/categories/all-bots.png' as const;
    public readonly websiteUrl = 'https://disforge.com/bots' as const;
    public readonly apiUrl = 'https://disforge.com/api' as const;

    public async postStatistics(options: List.PostOptions) {
        options = Validate.postOptions(options);

        await this._performRequest('POST', `/botstats/${this.clientId}`, {
            body: { servers: options.guildCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostSuccess, options))
            .catch(error => this.emit(List.Events.PostError, options, error));
    }
}
