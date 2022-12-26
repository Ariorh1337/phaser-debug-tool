import { hasProp } from "../utils/extra";

export default function defineVisible(folder: any, obj: any) {
    if (hasProp(obj, "visible")) {
        const input = folder.addInput(obj, "visible");
        folder.on("refresh", () => input.refresh());
    }
}