import { hasProp } from "../utils/extra";

export default function defineFill(folder: any, obj: any) {
    defineFillColor(folder, obj);
    defineFillAlpha(folder, obj);
}

export function defineFillColor(folder: any, obj: any) {
    if (hasProp(obj, "fillColor")) {
        const input = folder.addInput(obj, "fillColor", { view: 'color' });
        folder.on("refresh", () => input.refresh());
    }
}

export function defineFillAlpha(folder: any, obj: any) {
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
