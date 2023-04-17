import { Messages } from './Messages';

function makeError(Base: typeof Error) {
    return class ListsError<K extends keyof typeof Messages> extends Base {
        public readonly code: K;

        public constructor(code: K, ...args: Parameters<(typeof Messages)[K]>) {
            super(resolveMessage(code, ...args));
            this.code = code;
            Error.prepareStackTrace?.(this, ListsError as any);
        }

        public override get name() {
            return `${super.name} [${this.code}]`;
        }
    };
}

function resolveMessage<K extends keyof typeof Messages>(
    code: K,
    ...args: Parameters<(typeof Messages)[K]>
) {
    const message = Messages[code];
    if (!message) throw new Error('No message associated with the code provided.');

    // @ts-expect-error Tuple type thing
    if (typeof message === 'function') return message(...args);

    args.unshift(message);
    return String(...args);
}

const _Error = makeError(Error);
const _TypeError = makeError(TypeError);
const _RangeError = makeError(RangeError);
export { _Error as Error, _TypeError as TypeError, _RangeError as RangeError };
