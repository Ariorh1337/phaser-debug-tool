import { hasProp } from "../utils/extra";

export default function defineCrop(folder: any, obj: any) {
    if (!hasProp(obj, "_crop")) return;

    const proxy3 = {
        _crop: false,
        get crop() {
            if (!this._crop) {
                this._crop = obj._crop.x === 0 && obj._crop.y === 0 && obj._crop.width === obj.width && obj._crop.height === obj.height;                
            }

            return this._crop;
        },
        set crop(value) {
            this._crop = value;
        },
    };
    const input3 = folder.addInput(proxy3, "crop", {});
    folder.on("refresh", () => input3.refresh());

    const proxy1 = {
        vector2: {
            get x() {
                return obj._crop.x;
            },
            set x(value) {
                const { x, y, width, height } = obj._crop;
                if (!proxy3.crop) return;

                obj.setCrop(value, y, width, height);
            },
            get y() {
                return obj._crop.y;
            },
            set y(value) {
                const { x, y, width, height } = obj._crop;
                if (!proxy3.crop) return;

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
                return Math.min(obj.width, obj._crop.width);
            },
            set x(value) {
                const { x, y, height } = obj._crop;
                if (!proxy3.crop) return;

                obj.setCrop(x, y, value, height);
            },
            get y() {
                return Math.min(obj.height, obj._crop.height);
            },
            set y(value) {
                const { x, y, width } = obj._crop;
                if (!proxy3.crop) return;

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
