import { hasProp } from "../utils/extra";

export default function defineTextStyle(folder: any, obj: any) {
    if (!hasProp(obj, "style")) return;
    const proxy = {
        get align() {
            return obj.style.align;
        },
        set align(value) {
            obj.style.align = value;
            obj.setStyle(obj.style);
        },

        get fontFamily() {
            return obj.style.fontFamily;
        },
        set fontFamily(value) {
            obj.style.fontFamily = value;
            obj.setStyle(obj.style);
        },

        get fontSize() {
            return Number(obj.style.fontSize.replace("px", ""));
        },
        set fontSize(value) {
            obj.style.fontSize = `${value}px`;
            obj.setStyle(obj.style);
        },

        get wordWrapWidth() {
            return obj.style.wordWrapWidth || 0;
        },
        set wordWrapWidth(value) {
            obj.style.wordWrapWidth = value;
            obj.setStyle(obj.style);
        },

        get color() {
            return obj.style.color;
        },
        set color(value) {
            obj.style.color = value;
            obj.setStyle(obj.style);
        },

        get shadowFill() {
            return obj.style.shadowFill;
        },
        set shadowFill(value) {
            obj.style.shadowFill = value;
            obj.setStyle(obj.style);
        },

        get shadowColor() {
            return obj.style.shadowColor;
        },
        set shadowColor(value) {
            obj.style.shadowColor = value;
            obj.setStyle(obj.style);
        },

        get shadowBlur() {
            return obj.style.shadowBlur;
        },
        set shadowBlur(value) {
            obj.style.shadowBlur = value;
            obj.setStyle(obj.style);
        },

        get shadowStroke() {
            return obj.style.shadowStroke;
        },
        set shadowStroke(value) {
            obj.style.shadowStroke = value;
            obj.setStyle(obj.style);
        },

        get stroke() {
            return obj.style.stroke;
        },
        set stroke(value) {
            obj.style.stroke = value;
            obj.setStyle(obj.style);
        },

        get strokeThickness() {
            return obj.style.strokeThickness;
        },
        set strokeThickness(value) {
            obj.style.strokeThickness = value;
            obj.setStyle(obj.style);
        },
    };

    const alignOptions = ["left", "center", "right"];
    const input1 = folder.addInput(proxy, "align", {
        options: alignOptions.map((a) => ({ text: a, value: a })),
    });
    folder.on("refresh", () => input1.refresh());

    const input2 = folder.addInput(proxy, "fontFamily", { format: String });
    folder.on("refresh", () => input2.refresh());

    const input3 = folder.addInput(proxy, "fontSize", {
        format: Number,
        step: 1,
    });
    folder.on("refresh", () => input3.refresh());

    const input4 = folder.addInput(proxy, "wordWrapWidth", {
        format: Number,
        step: 1,
    });
    folder.on("refresh", () => input4.refresh());

    if (typeof obj.style.color === "string") {
        const input5 = folder.addInput(proxy, "color", { view: "color" });
        folder.on("refresh", () => input5.refresh());
    }

    const input6 = folder.addInput(proxy, "shadowFill", { format: Boolean });
    folder.on("refresh", () => input6.refresh());

    const input7 = folder.addInput(proxy, "shadowColor", { view: "color" });
    folder.on("refresh", () => input7.refresh());

    const input8 = folder.addInput(proxy, "shadowBlur", {
        format: Number,
        step: 1,
    });
    folder.on("refresh", () => input8.refresh());

    const shadowOffsetProxy = {
        vector2: {
            get x() {
                return obj.style.shadowOffsetX;
            },
            set x(value) {
                obj.style.shadowOffsetX = value;
                obj.setStyle(obj.style);
            },
            get y() {
                return obj.style.shadowOffsetY;
            },
            set y(value) {
                obj.style.shadowOffsetY = value;
                obj.setStyle(obj.style);
            },
        },
    };
    const input9 = folder.addInput(shadowOffsetProxy, "vector2", {
        label: "shadowOffset",
        x: { step: 1 },
        y: { step: 1 },
    });
    folder.on("refresh", () => input9.refresh());

    const input10 = folder.addInput(proxy, "shadowStroke", { format: Boolean });
    folder.on("refresh", () => input10.refresh());

    const input11 = folder.addInput(proxy, "stroke", { view: "color" });
    folder.on("refresh", () => input11.refresh());

    const input12 = folder.addInput(proxy, "strokeThickness", {
        format: Number,
        step: 1,
    });
    folder.on("refresh", () => input12.refresh());

    const paddingYProxy = {
        vector2: {
            get x() {
                return obj.padding.top || 0;
            },
            set x(value) {
                const { left, top, right, bottom } = obj.padding;
                obj.setPadding(left, value, right, bottom);
            },
            get y() {
                return obj.padding.bottom || 0;
            },
            set y(value) {
                const { left, top, right, bottom } = obj.padding;
                obj.setPadding(left, top, right, value);
            },
        },
    };
    const input13 = folder.addInput(paddingYProxy, "vector2", {
        label: "padding (top, bottom)",
        x: { step: 1 },
        y: { step: 1 },
    });
    folder.on("refresh", () => input13.refresh());

    const paddingXProxy = {
        vector2: {
            get x() {
                return obj.padding.left || 0;
            },
            set x(value) {
                const { left, top, right, bottom } = obj.padding;
                obj.setPadding(value, top, right, bottom);
            },
            get y() {
                return obj.padding.right || 0;
            },
            set y(value) {
                const { left, top, right, bottom } = obj.padding;
                obj.setPadding(left, top, value, bottom);
            },
        },
    };
    const input14 = folder.addInput(paddingXProxy, "vector2", {
        label: "padding (left, right)",
        x: { step: 1 },
        y: { step: 1 },
    });
    folder.on("refresh", () => input14.refresh());
}
