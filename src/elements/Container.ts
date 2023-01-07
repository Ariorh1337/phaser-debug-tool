import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName from "../props/name";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineVisible from "../props/visible";
import addGameObject from "./GameObject";

export default function addContainer(
    pane: any,
    obj: Phaser.GameObjects.Container,
    options = { title: "", expanded: false }
) {
    const folder = pane.addFolder(options);
    (obj as any)._pane = folder;

    defineName(folder, obj);

    const settings = folder.addFolder({ title: "Settings", expanded: false });
    defineInput(settings, obj);
    defineActive(settings, obj);
    defineVisible(settings, obj);

    definePosition(settings, obj);
    defineAlpha(settings, obj);
    defineAngle(settings, obj);
    defineRotation(settings, obj);
    defineScale(settings, obj);
    defineBlendMode(settings, obj);

    const children = folder.addFolder({ title: "Children", expanded: false });
    (obj as any)._paneChild = children;

    obj.list.forEach((child: any) => {
        if (child._pane) return;
        addGameObject(children, child);
    });

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);
}
