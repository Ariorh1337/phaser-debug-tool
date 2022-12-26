import { hasProp } from "../utils/extra";

export default function defineOrigin(folder: any, obj: any) {
    if (!(hasProp(obj, "originX") && hasProp(obj, "originY"))) return;

    const proxy = {
        vector2: {
            get x() {
                return obj.originX;
            },
            set x(value) {
                obj.setOrigin(value, obj.originY);
            },
            get y() {
                return obj.originY;
            },
            set y(value) {
                obj.setOrigin(obj.originX, value);
            },
        },
    };

    const input = folder.addInput(proxy, "vector2", {
        label: "origin",
        x: {
            step: 0.01,
        },
        y: {
            step: 0.01,
        },
    });
    folder.on("refresh", () => input.refresh());
}
