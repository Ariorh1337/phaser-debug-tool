import { hasProp } from "../utils/extra";

export default function defineScroll(folder: any, obj: any) {
    if (!(hasProp(obj, "scrollY") && hasProp(obj, "scrollY"))) return;
    const proxy = {
        vector2: {
            get x() {
                return obj.scrollX;
            },
            set x(value) {
                obj.scrollX = value;
            },
            get y() {
                return obj.scrollY;
            },
            set y(value) {
                obj.scrollY = value;
            },
        },
    };

    const input = folder.addInput(proxy, "vector2", {
        label: "scroll",
        x: {
            step: 5,
        },
        y: {
            step: 5,
        }
    });
    folder.on("refresh", () => input.refresh());
}
