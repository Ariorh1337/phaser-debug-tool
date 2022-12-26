import { hasProp } from "../utils/extra";

export default function defineSize(folder: any, obj: any, isInput = false) {
    if (!(hasProp(obj, "x") && hasProp(obj, "y"))) return;
    const proxy = {
        vector2: {
            get x() {
                return obj.width || 0;
            },
            set x(value) {
                if (!isInput) return;
                obj.width = value;
            },
            get y() {
                return obj.height || 0;
            },
            set y(value) {
                if (!isInput) return;
                obj.height = value;
            },
        },
    };

    const input = folder.addInput(proxy, "vector2", {
        label: "size (w, h)",
        x: {
            step: 1,
        },
        y: {
            step: 1,
        }
    });
    folder.on("refresh", () => input.refresh());
}
