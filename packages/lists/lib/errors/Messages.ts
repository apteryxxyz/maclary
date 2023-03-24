export const Messages = {
    MissingAPIToken: (listTitle: string) => `An authorization token is required for ${listTitle}`,
    MissingWebhookToken: (listTitle: string) => `A webhook token is required for ${listTitle}`,

    InvalidType: (type: string) => `Value must be a ${type}.`,
    MustBePositive: (value: number) => `Value must be positive, received ${value}.`,
};
