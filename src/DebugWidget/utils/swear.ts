export default class Swear<T> {
    public state = "pending" as "pending" | "done" | "canceled" | "rejected";
    public promise: Promise<T>;
    public value?: T;

    private _cancel: boolean;
    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: any) => void;

    constructor() {
        this._cancel = false;

        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    cancel = () => {
        this._cancel = true;
        this.state = "canceled";
    };

    resolve = (value?: T | PromiseLike<T>) => {
        if (this._cancel) return;
        this.state = "done";
        this.value = value as T;
        this._resolve(value);
    };

    reject = (reason?: any) => {
        if (this._cancel) return;
        this.state = "rejected";
        this._reject(reason);
    };
}