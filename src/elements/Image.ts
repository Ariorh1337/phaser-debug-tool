import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineBlendMode from "../props/blendMode";
import defineCrop from "../props/crop";
import defineDebug from "../props/debug";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName, { observeName } from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineTexture from "../props/texture";
import defineTint from "../props/tint";
import defineToBase64 from "../props/toBase64";
import defineVisible from "../props/visible";
import { addGameObjectFolder } from "../utils/extra";

export default async function addImage(
    pane: any,
    obj: Phaser.GameObjects.Image,
    options = { title: "", expanded: false }
) {
    const folder = await addGameObjectFolder(pane, options, obj);
    observeName(folder, obj);

    const create = () => {
        defineName(folder, obj);

        defineDebug(folder, obj);

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
        defineCrop(folder, obj);
        defineTint(folder, obj);
        defineTexture(folder, obj);
        defineBlendMode(folder, obj);
        defineToBase64(folder, obj);
        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}
