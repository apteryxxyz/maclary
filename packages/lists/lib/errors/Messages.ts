export const Messages = {
    MissingAPIToken: (list: string) => `An authorization token is required for ${list}`,
    MissingWebhookToken: (list: string) => `A webhook token is required for ${list}`,

    NotSupported: (list: string, method: string) => `${list} does not support ${method}.`,

    InvalidType: (name: string, type: string) => `'${name}' must be a ${type}`,
    MustBePositive: (name: string, value: number) =>
        `'${name}' must be positive, received ${value}`,
};
