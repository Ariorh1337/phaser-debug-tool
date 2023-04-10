import { hasProp } from "../utils/extra";

export default function defineBlendMode(folder: any, obj: any) {
    if (hasProp(obj, "blendMode")) {
        const input = folder.addInput(obj, "blendMode", {
            options: Phaser.BlendModes,
        });
        folder.on("refresh", () => input.refresh());
    }
}
