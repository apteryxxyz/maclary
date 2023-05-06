import EventEmitter from 'node:events';
import type { Request, Response } from 'express';
import express from 'express';
import { List } from './List';
import { Utilities } from '~/utilities/Utilities';
import { Validate } from '~/utilities/Validate';

export class Webhook extends EventEmitter {
    public readonly lists: ReadonlyMap<string, List & List.WithWebhookVoteReceiving>;
    public readonly options: Webhook.Options;

    public readonly server: ReturnType<typeof express>;

    public constructor(lists: (List & List.WithWebhookVoteReceiving)[], options: Webhook.Options) {
        super();

        // Filter out lists that don't support vote posting
        const listsWithStatistics = lists.filter(List.hasVoteReceiving);
        const listEntries = listsWithStatistics.map(list => [list.key, list] as const);
        this.lists = Utilities.makeReadonlyMap(listEntries);

        this.options = Validate.webhookOptions(options);

        this.server = express();
        this.server.use(express.json());
        this._init();
    }

    private _init() {
        for (const list of this.lists.values()) {
            this.server.post(`/receive/${list.key}/vote`, (req, res) => {
                const authorisation = req.headers.authorization;
                if (authorisation !== list.webhookToken) return res.sendStatus(401);

                if (!req.body) return res.sendStatus(400);

                const vote = list._constructWebhookVote(req.body);
                list.emit(Webhook.Events.NewVote, vote);
                this.emit(Webhook.Events.NewVote, list, vote);

                return Promise.resolve(this.options.handleAfterVote?.(req, res)) //
                    .then(() => (res.headersSent ? void 0 : res.sendStatus(200)));
            });
        }

        this.server.listen(this.options.port, () => {
            console.log('Online');
        });
    }
}

export namespace Webhook /* Data */ {
    export interface Options {
        port: number;
        handleAfterVote?(req: Request, res: Response): void | Promise<void>;
    }
}

export namespace Webhook /* Events */ {
    export enum Events {
        NewVote = 'newVote',
    }

    export interface EventParams {
        [Events.NewVote]: [List, List.WebhookVote<unknown>];
    }
}
