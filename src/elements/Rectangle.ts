import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineFill from "../props/fill";
import defineInput from "../props/input";
import defineName from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineStroke from "../props/stroke";
import defineVisible from "../props/visible";

export default function addRectangle(
    pane: any,
    obj: Phaser.GameObjects.Rectangle,
    options = { title: "", expanded: false }
) {
    const folder = pane.addFolder(options);
    (obj as any)._pane = folder;

    defineName(folder, obj);
    defineInput(folder, obj);
    defineActive(folder, obj);
    defineVisible(folder, obj);

    definePosition(folder, obj);
    defineSize(folder, obj, true);
    defineOrigin(folder, obj);
    defineAlpha(folder, obj);
    defineAngle(folder, obj);
    defineRotation(folder, obj);
    defineScale(folder, obj);

    folder.addInput(obj, "isFilled", { label: "filled" });
    defineFill(folder, obj);
    folder.addInput(obj, "isStroked", { label: "stroked" });
    defineStroke(folder, obj);
    
    defineBlendMode(folder, obj);
    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
