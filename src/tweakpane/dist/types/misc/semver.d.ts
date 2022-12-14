/***
 * A simple semantic versioning perser.
 */
export declare class Semver {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease: string | null;
    /**
     * @hidden
     */
    constructor(text: string);
    toString(): string;
}
