import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName, { parseName } from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineText from "../props/text";
import defineTexture from "../props/texture";
import defineVisible from "../props/visible";
import { addGameObjectFolder, hasProp } from "../utils/extra";

export default function addBitmapText(
    pane: any,
    obj: Phaser.GameObjects.BitmapText,
    options = { title: "", expanded: false }
) {
    const folder = addGameObjectFolder(pane, options, obj);
    folder.title = folder.title || parseName(obj);

    const create = () => {
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

        defineDropShadow(folder, obj);
        defineDropShadowColor(folder, obj);
        defineDropShadowAlpha(folder, obj);
        defineAlign(folder, obj);

        defineBlendMode(folder, obj);
        defineTexture(folder, obj);

        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}

function defineDropShadow(folder: any, obj: any) {
    if (!hasProp(obj, "dropShadowX")) return;
    if (!hasProp(obj, "dropShadowY")) return;

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

function defineDropShadowColor(folder: any, obj: any) {
    if (!hasProp(obj, "dropShadowColor")) return;

    folder.addInput(obj, "dropShadowColor", { view: "color" });
}

function defineDropShadowAlpha(folder: any, obj: any) {
    if (!hasProp(obj, "dropShadowAlpha")) return;

    folder.addInput(obj, "dropShadowAlpha", { min: 0, max: 1, step: 0.01 });
}

function defineAlign(folder: any, obj: any) {
    if (!hasProp(obj, "_align")) return;

    folder.addInput(obj, "_align", {
        label: "align",
        options: [
            { text: "left", value: 0 },
            { text: "center", value: 1 },
            { text: "right", value: 2 },
        ],
    });
}
