import { hasProp } from "../utils/extra";

export default function defineRotation(folder: any, obj: any) {
    if (hasProp(obj, "rotation")) {
        const input = folder.addInput(obj, "rotation", {
            step: 0.01,
        });

        folder.on("refresh", () => input.refresh());
    }
}
