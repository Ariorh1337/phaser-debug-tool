/**
 * Small runtime helpers that used to be taken from the global `Phaser` namespace.
 *
 * The extension no longer depends on `window.Phaser`: Phaser 4 ESM builds never define it and the
 * namespace object bundlers produce is frozen, so everything we need is reimplemented here.
 */

/** `Phaser.Core.Events.DESTROY`, `Phaser.Scenes.Events.DESTROY` and `Phaser.GameObjects.Events.DESTROY`. */
export const DESTROY = "destroy";

/** `Phaser.Math.Between` */
export function between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** `Phaser.Math.DegToRad` */
export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/** `Phaser.Utils.String.UUID` */
export function uuid(): string {
    const c = (window as any).crypto;

    if (c && typeof c.randomUUID === "function") {
        try {
            return c.randomUUID();
        } catch (e) {
            // insecure context, fall through
        }
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const r = (Math.random() * 16) | 0;
        const v = char === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/** `Phaser.Geom.Rectangle.ContainsPoint` */
export function rectContainsPoint(
    x: number,
    y: number,
    width: number,
    height: number,
    px: number,
    py: number
): boolean {
    if (width <= 0 || height <= 0) return false;

    return x <= px && x + width >= px && y <= py && y + height >= py;
}

/** `Phaser.BlendModes` (identical in Phaser 3 and 4) */
export const BLEND_MODES: { [name: string]: number } = {
    SKIP_CHECK: -1,
    NORMAL: 0,
    ADD: 1,
    MULTIPLY: 2,
    SCREEN: 3,
    OVERLAY: 4,
    DARKEN: 5,
    LIGHTEN: 6,
    COLOR_DODGE: 7,
    COLOR_BURN: 8,
    HARD_LIGHT: 9,
    SOFT_LIGHT: 10,
    DIFFERENCE: 11,
    EXCLUSION: 12,
    HUE: 13,
    SATURATION: 14,
    COLOR: 15,
    LUMINOSITY: 16,
    ERASE: 17,
    SOURCE_IN: 18,
    SOURCE_OUT: 19,
    SOURCE_ATOP: 20,
    DESTINATION_OVER: 21,
    DESTINATION_IN: 22,
    DESTINATION_OUT: 23,
    DESTINATION_ATOP: 24,
    LIGHTER: 25,
    COPY: 26,
    XOR: 27,
};
