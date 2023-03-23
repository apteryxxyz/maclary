import { Messages } from './Messages';

function makeError(Base: typeof Error) {
    return class BotListsError extends Base {
        public readonly code: keyof typeof Messages;

        public constructor(code: keyof typeof Messages, ...args: unknown[]) {
            super(resolveMessage(code, ...args));
            this.code = code;
            Error.prepareStackTrace?.(this, BotListsError as any);
        }

        public override get name() {
            return `${super.name} [${this.code}]`;
        }
    };
}

function resolveMessage(code: keyof typeof Messages, ...args: unknown[]) {
    const message = Messages[code];
    if (!message) throw new Error('No message associated with the code provided.');

    // @ts-expect-error 2556
    if (typeof message === 'function') return message(...args);

    args.unshift(message);
    return String(...args);
}

const _Error = makeError(Error);
const _TypeError = makeError(TypeError);
const _RangeError = makeError(RangeError);
export { _Error as Error, _TypeError as TypeError, _RangeError as RangeError };
