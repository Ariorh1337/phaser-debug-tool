import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName, { observeName } from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineVisible from "../props/visible";
import { addGameObjectFolder, hasProp } from "../utils/extra";
import addSpineContainer from "./SpineContainer";

export default function addSpine(
    pane: any,
    obj: any,
    options = { title: "", expanded: false }
) {
    if (obj.list) {
        return addSpineContainer(pane, obj, options);
    }

    const folder = addGameObjectFolder(pane, options, obj);
    observeName(folder, obj);

    const create = () => {
        defineName(folder, obj);
        defineVisible(folder, obj);

        defineInput(folder, obj);
        defineActive(folder, obj);

        definePosition(folder, obj);
        defineSize(folder, obj);
        defineOrigin(folder, obj);
        defineAlpha(folder, obj);
        defineAngle(folder, obj);
        defineRotation(folder, obj);
        defineScale(folder, obj);
        defineDebug(folder, obj);
        defineTimeScale(folder, obj);
        defineSkeleton(folder, obj);

        defineBlendMode(folder, obj);

        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}

export function defineDebug(folder: any, obj: any) {
    if (!hasProp(obj, "drawDebug")) return;

    folder.addInput(obj, "drawDebug");
}

export function defineTimeScale(folder: any, obj: any) {
    if (!hasProp(obj, "timeScale")) return;

    folder.addInput(obj, "timeScale", { min: 0, max: 10, step: 0.01 });
}

export function defineSkeleton(folder: any, obj: any) {
    if (!hasProp(obj, "skeleton")) return;

    const list1Opt = () =>
        obj.scene.spine.json.entries.keys().map((a: string) => ({
            text: a,
            value: a,
        }));

    const saved = { list1: undefined, list2: undefined as any };

    const proxy = {
        get skeleton() {
            if (obj.skeletonKey) return obj.skeletonKey;

            obj.skeletonKey = whatIsMySkeleton(obj);

            return obj.skeletonKey;
        },
        set skeleton(value) {
            const entries = obj.scene.spine.json.entries;

            if (!entries.get(value)) {
                obj.skeletonKey = whatIsMySkeleton(obj);
            } else {
                obj.skeletonKey = value;
            }

            const data = entries.get(obj.skeletonKey);
            obj.setSkeletonFromJSON(value, data);

            if (saved.list2) checkAnimations(saved.list2, obj);
        },
    };

    saved.list1 = folder.addInput(proxy, "skeleton", { options: list1Opt() });
    folder.on("refresh", () => (saved.list1 as any)?.refresh());
    saved.list2 = folder.addFolder({ title: "Animations", expanded: false });
    checkAnimations(saved.list2, obj);
}

export function whatIsMySkeleton(obj: any) {
    const hash = obj.skeletonData.hash;
    const entries = obj.scene.spine.json.entries;
    const search = (a: any) => hash === a.skeleton?.hash;
    const key = entries.keys()[entries.values().findIndex(search)];

    return key;
}

export function checkAnimations(folder: any, obj: any) {
    folder.children.forEach((a: any) => a.dispose());

    obj.skeletonData.animations.map((a: any) => {
        const animation = a.name;

        const btn = folder.addButton({ title: animation });
        btn.on("click", () => obj.play(animation));
    });
}
