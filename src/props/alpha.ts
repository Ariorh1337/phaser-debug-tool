import { hasProp } from "../utils/extra";

export default function defineAlpha(folder: any, obj: any) {
    if (hasProp(obj, "alpha")) {
        const input = folder.addInput(obj, "alpha", {
            min: 0,
            max: 1,
            step: 0.01,
        });
        folder.on("refresh", () => input.refresh());
    }
}
