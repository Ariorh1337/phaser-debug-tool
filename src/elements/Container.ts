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
    defineVisible(folder, obj);

    const settings = folder.addFolder({ title: "Settings", expanded: false });
    defineInput(settings, obj);
    defineActive(settings, obj);

    definePosition(settings, obj);
    defineAlpha(settings, obj);
    defineAngle(settings, obj);
    defineRotation(settings, obj);
    defineScale(settings, obj);
    defineBlendMode(settings, obj);

    const children = folder.addFolder({ title: "Children", expanded: false });
    (obj as any)._paneChild = children;

    const addMMethod = obj.add;

    (obj as any).add = function (...args: any[]) {
        const obj = addMMethod.apply(this, args as any);

        if (Array.isArray(args[0])) {
            args[0].forEach((child: any) => {
                if (child._pane) {
                    return child._pane.movePaneTo(children);
                }

                addGameObject(children, child);
            });
        } else {
            if (args[0]._pane) {
                return args[0]._pane.movePaneTo(children);
            }
            addGameObject(children, args[0]);
        }

        return obj;
    };

    obj.list.forEach((child: any) => {
        if (child._pane) {
            return child._pane.movePaneTo(children);
        }

        addGameObject(children, child);
    });

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);
}
