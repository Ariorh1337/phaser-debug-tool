/**
 * A class representing a promise that can be canceled.
 */
export default class Swear<T> {
    /**
     * The current state of the promise.
     */
    public state: "pending" | "done" | "canceled" | "rejected" = "pending";

    /**
     * The promise instance.
     */
    public promise: Promise<T>;

    private _cancel = false;
    private _resolve!: (value: T) => void;
    private _reject!: (reason?: any) => void;

    /**
     * Creates a new Swear instance.
     */
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    /**
     * Cancels the promise.
     */
    cancel = () => {
        this._cancel = true;
        this.state = "canceled";
    };

    /**
     * Resolves the promise with the given data.
     * @param value The data to resolve the promise with.
     */
    resolve = (value: T) => {
        if (this._cancel) return;
        this.state = "done";
        this._resolve(value);
    };

    /**
     * Rejects the promise with the given data.
     * @param reason The data to reject the promise with.
     */
    reject = (reason?: any) => {
        if (this._cancel) return;
        this.state = "rejected";
        this._reject(reason);
    };
}
