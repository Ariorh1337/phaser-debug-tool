import defineActive from "../props/active";
import { addChild, defineAdd, defineAddAt, defineAddChildBtn } from "../props/add";
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

    const create = () => {
        defineInput(settings, obj);
        defineActive(settings, obj);

        definePosition(settings, obj);
        defineAlpha(settings, obj);
        defineAngle(settings, obj);
        defineRotation(settings, obj);
        defineScale(settings, obj);
        defineBlendMode(settings, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    const children = folder.addFolder({ title: "Children", expanded: false });
    (obj as any)._paneChild = children;

    defineAdd(children, obj);
    defineAddAt(children, obj);

    obj.list.forEach((child: any) => addChild(children, child));

    defineDestroy(folder, obj);
    defineAddChildBtn(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
