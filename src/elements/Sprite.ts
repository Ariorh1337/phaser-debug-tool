import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineCrop from "../props/crop";
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
import defineTimeScale from "../props/timeScale";
import defineToBase64 from "../props/toBase64";
import defineVisible from "../props/visible";
import { addGameObjectFolder } from "../utils/extra";

export default function addSprite(
    pane: any,
    obj: Phaser.GameObjects.Sprite,
    options = { title: "", expanded: false }
) {
    const folder = addGameObjectFolder(pane, options, obj);
    observeName(folder, obj);

    const create = () => {
        defineName(folder, obj);
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

        defineTimeScale(folder, obj.anims);

        defineCrop(folder, obj);
        defineTexture(folder, obj);

        const anims = folder.addFolder({
            title: "Animations",
            expanded: false,
        });
        checkAnimations(anims, obj);

        defineToBase64(folder, obj);
        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}

function checkAnimations(folder: any, obj: any) {
    folder.children.forEach((a: any) => a.dispose());

    Object.keys(obj.scene.anims.anims.entries).map((animation: any) => {
        const btn = folder.addButton({ title: animation });
        btn.on("click", () => obj.play(animation));
    });
}
