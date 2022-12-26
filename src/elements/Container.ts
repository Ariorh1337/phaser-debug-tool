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

    defineName(folder, obj);
    defineInput(folder, obj);
    defineActive(folder, obj);
    defineVisible(folder, obj);

    definePosition(folder, obj);
    defineAlpha(folder, obj);
    defineAngle(folder, obj);
    defineRotation(folder, obj);
    defineScale(folder, obj);
    defineBlendMode(folder, obj);

    const children = folder.addFolder({ title: "Children", expanded: false });
    (obj as any)._pane = children;

    obj.list.forEach((child: any) => {
        if (child._pane) return;
        addGameObject(children, child);
    });

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);
}
