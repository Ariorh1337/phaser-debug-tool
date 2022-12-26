import { hasProp } from "../utils/extra";

export default function defineFillAlpha(folder: any, obj: any) {
    if (hasProp(obj, "fillAlpha")) {
        const input = folder.addInput(obj, "fillAlpha", {
            min: 0,
            max: 1,
            step: 0.01,
            format: String,
        });
        folder.on("refresh", () => input.refresh());
    }
}
