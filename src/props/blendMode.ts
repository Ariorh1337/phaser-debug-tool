import { hasProp } from "../utils/extra";
import { BLEND_MODES } from "../utils/phaser";

export default function defineBlendMode(folder: any, obj: any) {
    if (hasProp(obj, "blendMode")) {
        const input = folder.addInput(obj, "blendMode", {
            options: BLEND_MODES,
        });
        folder.on("refresh", () => input.refresh());
    }
}
