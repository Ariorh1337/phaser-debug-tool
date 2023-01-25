import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineText from "../props/text";
import defineTexture from "../props/texture";
import defineVisible from "../props/visible";

export default function addBitmapText(
    pane: any,
    obj: Phaser.GameObjects.BitmapText,
    options = { title: "", expanded: false }
) {
    const folder = pane.addFolder(options);
    (obj as any)._pane = folder;

    defineName(folder, obj);
    defineInput(folder, obj);
    defineActive(folder, obj);
    defineVisible(folder, obj);
    definePosition(folder, obj);
    defineSize(folder, obj);
    defineOrigin(folder, obj);
    defineScale(folder, obj);
    defineAngle(folder, obj);
    defineRotation(folder, obj);
    defineText(folder, obj);
    defineAlpha(folder, obj);

    folder.addInput(obj, "fontSize", { step: 1 });
    folder.addInput(obj, "letterSpacing", { step: 1 });

    if (obj.dropShadowX && obj.dropShadowY) {
        const dropShadowProxy = {
            vector2: {
                get x() {
                    return obj.dropShadowX || 0;
                },
                set x(value) {
                    obj.dropShadowX = value;
                },
                get y() {
                    return obj.dropShadowY || 0;
                },
                set y(value) {
                    obj.dropShadowY = value;
                },
            },
        };
        folder.addInput(dropShadowProxy, "vector2", {
            label: "dropShadow",
            x: { step: 1 },
            y: { step: 1 },
        });
    }

    if (obj.dropShadowColor) {
        folder.addInput(obj, "dropShadowColor", { view: "color" });
    }

    if (obj.dropShadowAlpha) {
        folder.addInput(obj, "dropShadowAlpha", { min: 0, max: 1, step: 0.01 });
    }

    if ((obj as any)._align) {
        folder.addInput(obj, "_align", {
            label: "align",
            options: [
                { text: "left", value: 0 },
                { text: "center", value: 1 },
                { text: "right", value: 2 },
            ],
        });
    }
    
    defineBlendMode(folder, obj);
    defineTexture(folder, obj);

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
