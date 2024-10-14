import defineActive from "../props/active";
import { defineAdd, defineAddAt } from "../props/add";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName, { observeName } from "../props/name";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineVisible from "../props/visible";
import {
    addChildrenFolder,
    addGameObjectFolder,
    addedToScene,
} from "../utils/extra";

export default async function addContainer(
    pane: any,
    obj: Phaser.GameObjects.Container,
    options = { title: "", expanded: false }
) {
    const folder = await addGameObjectFolder(pane, options, obj);
    observeName(folder, obj);

    const settings = folder.addFolder({ title: "Settings", expanded: false });

    const create = () => {
        defineName(settings, obj);
        defineVisible(settings, obj);
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

    const children = addChildrenFolder(
        folder,
        { title: "Children", expanded: false },
        obj
    );

    defineAdd(children, obj);
    defineAddAt(children, obj);

    obj.list.forEach((child: any) => addedToScene(children, child));

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}
