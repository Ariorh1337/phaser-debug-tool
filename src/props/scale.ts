import { hasProp } from "../utils/extra";

export default function defineScale(folder: any, obj: any) {
    if (hasProp(obj, "scale")) {
        const proxy = {
            vector2: {
                get x() {
                    return obj.scaleX;
                },
                set x(value) {
                    obj.scaleX = value;
                },
                get y() {
                    return obj.scaleY;
                },
                set y(value) {
                    obj.scaleY = value;
                },
            },
        };

        const input1 = folder.addInput(proxy, "vector2", {
            label: "scale",
            x: {
                step: 0.01,
            },
            y: {
                step: 0.01,
            },
        });
        folder.on("refresh", () => input1.refresh());
    }
}
