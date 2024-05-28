import defineActive from "../props/active";
import defineAlpha from "../props/alpha";
import defineAngle from "../props/angle";
import defineDebug from "../props/debug";
import defineDeclare from "../props/declare";
import defineDestroy, { onDestroy } from "../props/destroy";
import defineInput from "../props/input";
import defineName, { observeName } from "../props/name";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScale from "../props/scale";
import defineSize from "../props/size";
import defineTexture from "../props/texture";
import defineToBase64 from "../props/toBase64";
import defineVisible from "../props/visible";
import { addGameObjectFolder } from "../utils/extra";

export default function addMesh(
    pane: any,
    obj: Phaser.GameObjects.Mesh,
    options = { title: "", expanded: false }
) {
    const folder = addGameObjectFolder(pane, options, obj);
    observeName(folder, obj);

    const create = () => {
        defineName(folder, obj);

        //

        defineDebug(
            folder,
            obj,
            (graphics) => {
                obj.scene.time.delayedCall(10, () => {
                    obj.setData("points", pointsObj(obj));
                });

                const input = obj.scene.input;

                type Pointer = Phaser.Input.Pointer;

                const func1 = (p: Pointer) => onPointerDown(p, obj);
                input.on("pointerdown", func1);

                const func2 = (p: Pointer) => onPointerMove(p, obj);
                input.on("pointermove", func2);

                obj.once(Phaser.Core.Events.DESTROY, () => {
                    input.off("pointerdown", func1);
                    input.off("pointermove", func2);
                });

                obj.on("__debug", (value: boolean) => {
                    if (value) {
                        obj.setDebug(graphics);
                    } else {
                        obj.setDebug();
                    }
                });
                
                (obj as any).originX = 0.5;
                (obj as any).originY = 0.5;
            },
            (graphics) => {
                if (!obj.getData("points")) return;

                obj.getData("points").forEach((point: any, i: number) => {
                    graphics.beginPath();

                    const [x, y] = [point[0].tx, point[0].ty];
                    const [sa, se] = [
                        Phaser.Math.DegToRad(0),
                        Phaser.Math.DegToRad(360),
                    ];

                    graphics.arc(x, y, 3, sa, se, true, 0.02);
                    graphics.closePath();
                    graphics.strokePath();
                });
            }
        );

        //

        defineInput(folder, obj);
        defineActive(folder, obj);
        defineVisible(folder, obj);

        definePosition(folder, obj);
        defineSize(folder, obj);
        defineAlpha(folder, obj);
        defineAngle(folder, obj);
        defineRotation(folder, obj);
        defineScale(folder, obj);

        defineTexture(folder, obj);

        defineToBase64(folder, obj);
        defineDestroy(folder, obj);
        defineDeclare(folder, obj);

        folder.controller_.off("open", create);
    };

    folder.controller_.on("open", create);

    onDestroy(obj, folder, options);

    return folder;
}

function pointsObj(gameobj: Phaser.GameObjects.Mesh) {
    var list = new Map();

    gameobj.vertices.forEach((ver) => {
        const key = `x:${ver.tx};y:${ver.ty}`;
        const points = list.get(key);

        if (points) points.push(ver);
        else list.set(key, [ver]);
    });

    return [...list.values()];
}

function onPointerDown(
    pointer: Phaser.Input.Pointer,
    mesh: Phaser.GameObjects.Mesh
) {
    const size = 5;

    const { x: x2, y: y2 } = pointer;

    const point = mesh.getData("points").find((p: any) => {
        const { tx: x, ty: y } = p[0];

        const onX = x > x2 - size && x < x2 + size;
        const onY = y > y2 - size && y < y2 + size;

        return onX && onY;
    });

    mesh.setData("point", point);

    if (point) {
        mesh.setData("dragging", undefined);
    }
}

let updateTrigger = false;
function onPointerMove(
    pointer: Phaser.Input.Pointer,
    mesh: Phaser.GameObjects.Mesh
) {
    if (!pointer.isDown) return;
    if (!mesh.getData("point")) return;

    mesh.getData("point").forEach((point: any) => {
        const offsetX = point.tx - pointer.x;
        const offsetY = point.ty - pointer.y;

        point.x -= offsetX / mesh.width;
        point.y += offsetY / mesh.height;
    });

    if (updateTrigger) {
        (mesh as any).rotateZ += 0.0000000001;
    } else {
        (mesh as any).rotateZ -= 0.0000000001;
    }

    updateTrigger = !updateTrigger;
}
