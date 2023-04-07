import { hasProp } from "../utils/extra";

export default function definePosition(folder: any, obj: any) {
    if (!(hasProp(obj, "x") && hasProp(obj, "y"))) return;

    const proxy = {
        vector2: {
            get x() {
                return obj.x;
            },
            set x(value) {
                obj.x = value;
            },
            get y() {
                return obj.y;
            },
            set y(value) {
                obj.y = value;
            },
        },
    };

    const input = folder.addInput(proxy, "vector2", {
        label: "pos (x, y)",
        x: { step: 1 },
        y: { step: 1 },
    });

    folder.on("refresh", () => input.refresh());

    const proxy2 = {
        vector: {
            get x() {
                const width = obj.scene?.cameras?.main?.width || 1;

                return obj.x / width;
            },
            set x(value) {
                const width = obj.scene?.cameras?.main?.width || 1;

                obj.x = value * width;
            },
            get y() {
                const height = obj.scene?.cameras?.main?.height || 1;

                return obj.y / height;
            },
            set y(value) {
                const height = obj.scene?.cameras?.main?.height || 1;

                obj.y = value * height;
            },
        },
    };

    const input2 = folder.addInput(proxy2, "vector", {
        label: "pos% (x, y)",
        x: { step: 0.0001 },
        y: { step: 0.0001 },
    });

    folder.on("refresh", () => input2.refresh());
}
