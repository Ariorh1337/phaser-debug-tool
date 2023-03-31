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
import { addedToScene } from "../utils/extra";

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
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);
}

/**
 * Overwrite the add method to add the child to the container
 * @param folder 
 * @param obj 
 */
function defineAddAt(folder: any, obj: any) {
    const addMethod = obj.add;
    (obj as any).addAt = function (...args: any[]) {
        const obj = addMethod.apply(this, args as any);

        if (!Array.isArray(args[0])) {
            args[0] = [args[0]];
        }

        args[0].forEach((child: any) => addChild(folder, child));

        return obj;
    };
}

/**
 * Overwrite the add method to add the child to the container
 * @param folder 
 * @param obj 
 */
function defineAdd(folder: any, obj: any) {
    const addMethod = obj.add;
    (obj as any).add = function (...args: any[]) {
        const obj = addMethod.apply(this, args as any);

        if (!Array.isArray(args[0])) {
            args[0] = [args[0]];
        }

        args[0].forEach((child: any) => addChild(folder, child));

        return obj;
    };
}

/**
 * Function to add a child to the folder
 * @param folder 
 * @param obj 
 * @returns 
 */
function addChild(folder: any, obj: any) {
    if (obj._pane) {
        return obj._pane.movePaneTo(folder);
    }

    addedToScene(folder, obj);
}
