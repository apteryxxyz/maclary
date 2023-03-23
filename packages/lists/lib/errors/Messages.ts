export const Messages = {
    MissingAPIToken: (listTitle: string) => `An authorization token is required for ${listTitle}`,
    MissingWebhookToken: (listTitle: string) => `A webhook token is required for ${listTitle}`,

    InvalidList: 'That is not a valid list.',

    InvalidCount: 'Count must be a valid integer.',
    NegitiveCount: 'Count must be greater than or equal to 0.',
};
