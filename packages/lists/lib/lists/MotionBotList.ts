import { List } from '~/structures/List';
import { Validate } from '~/utilities/Validate';

export class MotionBotList extends List {
    public readonly key = 'motionbotlist' as const;
    public readonly title = 'Motion Botlist' as const;
    public readonly logoUrl = 'https://i.imgur.com/16NcFql.png' as const;
    public readonly websiteUrl = 'https://www.motiondevelopment.top/bot' as const;
    public readonly apiUrl = 'https://www.motiondevelopment.top/api/v1.2' as const;

    public async postStatistics(options: List.StatisticsOptions) {
        options = Validate.statisticsOptions(options);

        await this._performRequest('POST', `/bots/${this.clientId}/stats`, {
            headers: { key: this.apiToken },
            body: { guilds: options.guildCount },
            requiresApiToken: true,
        })
            .then(() => this.emit(List.Events.PostStatisticsSuccess, options))
            .catch(error => this.emit(List.Events.PostStatisticsError, options, error));
    }
}
