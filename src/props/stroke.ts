import { hasProp } from "../utils/extra";

export default function defineStroke(folder: any, obj: any) {
    defineStrokeWidth(folder, obj);
    defineStrokeColor(folder, obj);
    defineStrokeAlpha(folder, obj);
}

export function defineStrokeWidth(folder: any, obj: any) {
    if (hasProp(obj, "lineWidth")) {
        const input = folder.addInput(obj, "lineWidth", {
            step: 1,
            label: "strokeWidth",
        });
        folder.on("refresh", () => input.refresh());
    }
}

export function defineStrokeColor(folder: any, obj: any) {
    if (hasProp(obj, "strokeColor")) {
        const input = folder.addInput(obj, "strokeColor", { view: "color" });
        folder.on("refresh", () => input.refresh());
    }
}

export function defineStrokeAlpha(folder: any, obj: any) {
    if (hasProp(obj, "strokeAlpha")) {
        const input = folder.addInput(obj, "strokeAlpha", {
            min: 0,
            max: 1,
            step: 0.01,
            format: String,
        });
        folder.on("refresh", () => input.refresh());
    }
}
