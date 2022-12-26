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
        label: "position",
        x: {
            step: 2,
        },
        y: {
            step: 2,
        }
    });
    folder.on("refresh", () => input.refresh());
}
