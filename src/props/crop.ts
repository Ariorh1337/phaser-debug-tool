import { hasProp } from "../utils/extra";

export default function defineCrop(folder: any, obj: any) {
    if (!hasProp(obj, "_crop")) return;

    const proxy1 = {
        vector2: {
            get x() {
                return obj._crop.x;
            },
            set x(value) {
                const { x, y, width, height } = obj._crop;
                obj.setCrop(value, y, width, height);
            },
            get y() {
                return obj._crop.y;
            },
            set y(value) {
                const { x, y, width, height } = obj._crop;
                obj.setCrop(x, value, width, height);
            },
        },
    };

    const input1 = folder.addInput(proxy1, "vector2", {
        label: "crop (x, y)",
        x: { step: 1 },
        y: { step: 1 },
    });
    folder.on("refresh", () => input1.refresh());

    const proxy2 = {
        vector2: {
            get x() {
                return obj._crop.width || obj.width;
            },
            set x(value) {
                const { x, y, height } = obj._crop;
                obj.setCrop(x, y, value, height);
            },
            get y() {
                return obj._crop.height || obj.height;
            },
            set y(value) {
                const { x, y, width } = obj._crop;
                obj.setCrop(x, y, width, value);
            },
        },
    };

    const input2 = folder.addInput(proxy2, "vector2", {
        label: "crop (w, h)",
        x: { step: 1 },
        y: { step: 1 },
    });
    folder.on("refresh", () => input2.refresh());
}
