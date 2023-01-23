import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
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
import { hasProp } from "../utils/extra";
import addGameObject from "./GameObject";

export default function addSpine(
    pane: any,
    obj: any,
    options = { title: "", expanded: false }
) {
    const folder = pane.addFolder(options);
    (obj as any)._pane = folder;

    if (obj.list) obj.type = "SpineContainer";

    defineName(folder, obj);
    defineVisible(folder, obj);

    const settings = (() => {
        if (obj.type === "SpineContainer") {
            return folder.addFolder({ title: "Settings", expanded: false });
        }

        return folder;
    })();

    defineInput(settings, obj);
    defineActive(settings, obj);

    definePosition(settings, obj);
    defineSize(settings, obj);
    defineOrigin(settings, obj);
    defineAlpha(settings, obj);
    defineAngle(settings, obj);
    defineRotation(settings, obj);
    defineScale(settings, obj);
    defineDebug(settings, obj);
    defineTimeScale(settings, obj);
    defineSkeleton(settings, obj);

    defineBlendMode(settings, obj);

    if (obj.list) {
        const children = folder.addFolder({
            title: "Children",
            expanded: false,
        });

        (obj as any)._paneChild = children;

        obj.list.forEach((child: any) => {
            if (child._pane) {
                return child._pane.movePaneTo(children);
            }
            addGameObject(children, child);
        });
    }

    defineDestroy(folder, obj);
    defineDeclare(folder, obj);

    onDestroy(obj, folder, options);

    return folder;
}

function defineDebug(folder: any, obj: any) {
    if (!hasProp(obj, "drawDebug")) return;

    folder.addInput(obj, "drawDebug");
}

function defineTimeScale(folder: any, obj: any) {
    if (!hasProp(obj, "timeScale")) return;

    folder.addInput(obj, "timeScale", { min: 0, max: 10, step: 0.01 });
}

function defineSkeleton(folder: any, obj: any) {
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

function whatIsMySkeleton(obj: any) {
    const hash = obj.skeletonData.hash;
    const entries = obj.scene.spine.json.entries;
    const search = (a: any) => hash === a.skeleton?.hash;
    const key = entries.keys()[entries.values().findIndex(search)];

    return key;
}

function checkAnimations(folder: any, obj: any) {
    folder.children.forEach((a: any) => a.dispose());

    obj.skeletonData.animations.map((a: any) => {
        const animation = a.name;

        const btn = folder.addButton({ title: animation });
        btn.on("click", () => obj.play(animation));
    });
}
