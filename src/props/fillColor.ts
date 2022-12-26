import { hasProp } from "../utils/extra";

export default function defineFillColor(folder: any, obj: any) {
    if (hasProp(obj, "fillColor")) {
        const input = folder.addInput(obj, "fillColor", { view: 'color' });
        folder.on("refresh", () => input.refresh());
    }
}
