import { hasProp } from "../utils/extra";

export default function defineSize(folder: any, obj: any, isInput = false) {
    if (!(hasProp(obj, "width") && hasProp(obj, "height"))) return;
    const proxy = {
        vector2: {
            get x() {
                return isFinite(obj.width) ? (obj.width || 0) : 0;
            },
            set x(value) {
                if (isInput) {
                    obj.width = value;
                }
            },
            get y() {
                return isFinite(obj.height) ? (obj.height || 0) : 0;
            },
            set y(value) {
                if (isInput) {
                    obj.height = value;
                }
            },
        },
    };

    try {
        const input = folder.addInput(proxy, "vector2", {
            label: "size (w, h)",
            x: { step: 1 },
            y: { step: 1 },
        });
        folder.on("refresh", () => input.refresh());
    } catch (err) {
        console.warn(obj);
    }
}
