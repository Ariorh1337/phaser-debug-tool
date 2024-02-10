export default class Swear<T> {
    public state: "pending" | "done" | "canceled" | "rejected" = "pending";
    public promise: Promise<T>;
    public value: T | null = null;

    private _cancel = false;
    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: any) => void;

    constructor() {
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