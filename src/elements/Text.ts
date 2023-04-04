import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
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
import defineText from "../props/text";
import defineTextStyle from "../props/textStyle";
import defineVisible from "../props/visible";
import { addGameObjectFolder } from "../utils/extra";

export default function addText(
    pane: any,
    obj: Phaser.GameObjects.Text,
    options = { title: "", expanded: false }
) {
    const folder = addGameObjectFolder(pane, options, obj);

    defineName(folder, obj);

    const create = () => {
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

        defineText(folder, obj);
        defineTextStyle(folder, obj);

        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}
