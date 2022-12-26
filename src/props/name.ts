import { hasProp } from "../utils/extra";

export default function defineName(folder: any, obj: any) {
    folder.title = parseName(obj);

    if (hasProp(obj, "name")) {
        const proxy = {
            get name() {
                return obj.name;
            },
            set name(value) {
                obj.name = value;
                folder.title = parseName(obj);
            }
        };

        const input = folder.addInput(proxy, "name");
        folder.on("refresh", () => input.refresh());
    }
}

export function parseName(obj: any) {
    if (hasProp(obj, "name") && hasProp(obj, "type")) {
        return `(${obj.name}) ${obj.type}`;
    }

    return obj.name || obj.type || obj.constructor.name || "unknown";
}
