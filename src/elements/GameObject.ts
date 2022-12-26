import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineVisible from "../props/visible";
import addArc from "./Arc";
import addBitmapText from "./BitmapText";
import addContainer from "./Container";
import addImage from "./Image";
import addRectangle from "./Rectangle";
import addSprite from "./Sprite";
import addText from "./Text";

export default function addGameObject(
    pane: any,
    obj: any,
    options = { title: "", expanded: false }
) {
    if (obj._pane) return;

    if (obj.type && obj.type === "Image") {
        return addImage(pane, obj, options);
    }

    if (obj.type && obj.type === "Text") {
        return addText(pane, obj, options);
    }

    if (obj.type && obj.type === "BitmapText") {
        return addBitmapText(pane, obj, options);
    }

    if (obj.type && obj.type === "Sprite") {
        return addSprite(pane, obj, options);
    }

    if (obj.type && obj.type === "Rectangle") {
        return addRectangle(pane, obj, options);
    }

    if (obj.type && obj.type === "Arc") {
        return addArc(pane, obj, options);
    }

    if (obj.type && obj.type === "Container") {
        return addContainer(pane, obj, options);
    }

    const folder = pane.addFolder(options);
    obj._pane = folder;

    defineName(folder, obj);
    defineInput(folder, obj);
    defineActive(folder, obj);
    defineVisible(folder, obj);
    definePosition(folder, obj);
    defineSize(folder, obj);
    defineOrigin(folder, obj);
    defineAlpha(folder, obj);
    defineAngle(folder, obj);
    defineRotation(folder, obj);
    defineScale(folder, obj);
    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
