export class CombinedError extends Error {
    public readonly errors: Error[];

    public constructor(errors: Error[]) {
        super(`Multiple errors occurred`);
        this.errors = errors;
    }
}
