import { hasProp, propertyChangeTrigger } from "../utils/extra";

export default function defineName(folder: any, obj: any) {
    folder.title = folder.title || parseName(obj);

    if (hasProp(obj, "name")) {
        const proxy = {
            get name() {
                return obj.name;
            },
            set name(value) {
                obj.name = value;
            },
        };

        const input = folder.addInput(proxy, "name");
        folder.on("refresh", () => input.refresh());
    }
}

export function observeName(folder: any, obj: any) {
    folder.title = folder.title || parseName(obj);

    propertyChangeTrigger(obj, "name", () => {
        folder.title = parseName(obj);
    });
}

export function parseName(obj: any) {
    let [name, type] = ["", ""];

    if (hasProp(obj, "type")) {
        type = obj.type;
    } else {
        type = obj.constructor.name;
    }

    if (hasProp(obj, "name") && obj.name !== "") {
        name = obj.name;
    } else {
        const value = obj.constructor.name;
        name = value === "initialize" ? "" : value;
    }

    if (name === type) {
        return `() ${name}`;
    } else {
        return `(${name}) ${type}`;
    }
}
