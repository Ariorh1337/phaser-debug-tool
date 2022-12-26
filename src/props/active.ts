import { hasProp } from "../utils/extra";

export default function defineActive(folder: any, obj: any) {
    if (hasProp(obj, "active")) {
        const input = folder.addInput(obj, "active");
        folder.on("refresh", () => input.refresh());
    }
}
