import defineActive from "../props/active";
import { addChild, defineAdd, defineAddAt, defineAddChildBtn } from "../props/add";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineCrop from "../props/crop";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineTexture from "../props/texture";
import defineVisible from "../props/visible";
import addArc from "./Arc";
import addBitmapText from "./BitmapText";
import addContainer from "./Container";
import addImage from "./Image";
import addRectangle from "./Rectangle";
import addSpine from "./Spine";
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

    if (obj.type && obj.type === "Spine") {
        return addSpine(pane, obj, options);
    }

    const folder = pane.addFolder(options);
    obj._pane = folder;

    defineName(folder, obj);

    const settings = (() => {
        if (!obj.list) return folder;

        return folder.addFolder({ title: "Settings", expanded: false });
    })();

    const create = () => {
        defineInput(settings, obj);
        defineActive(settings, obj);
        defineVisible(settings, obj);
        definePosition(settings, obj);
        defineSize(settings, obj);
        defineOrigin(settings, obj);
        defineAlpha(settings, obj);
        defineAngle(settings, obj);
        defineRotation(settings, obj);
        defineScale(settings, obj);
        defineCrop(settings, obj);
        defineTexture(settings, obj);
        defineBlendMode(settings, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    if (obj.list) {
        const children = folder.addFolder({ title: "Children", expanded: false });
        (obj as any)._paneChild = children;

        defineAdd(children, obj);
        defineAddAt(children, obj);

        obj.list.forEach((child: any) => addChild(children, child));
    }

    defineDestroy(folder, obj);
    if (obj.list) defineAddChildBtn(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
