import { hasProp } from "../utils/extra";

export default function defineAngle(folder: any, obj: any) {
    if (hasProp(obj, "angle") && isFinite(obj.angle)) {
        const input = folder.addInput(obj, "angle", {
            step: 1,
        });
        folder.on("refresh", () => input.refresh());
    }
}
