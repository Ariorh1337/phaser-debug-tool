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
        defineInput(folder, obj);
        defineActive(folder, obj);
        defineVisible(folder, obj);

        obj.scene.time.delayedCall(10, () => {
            (obj as any)._points = pointsObj(obj);
        });

        defineDebug(folder, obj, (graphics: Phaser.GameObjects.Graphics) => {
            if (!(obj as any)._points) return;

            (obj as any)._points.forEach((point: any, i: number) => {
                graphics.beginPath();

                const [ x, y ] = [ point[0].tx, point[0].ty ];
                const [ sa, se ] = [ Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360) ];
        
                graphics.arc(x, y, 5, sa, se, true, 0.02);
                graphics.closePath();
                graphics.strokePath();
            });
        });

        const func1 = (p: Phaser.Input.Pointer) => onPointerDown(p, obj);
        obj.scene.input.on("pointerdown", func1);

        const func2 = (p: Phaser.Input.Pointer) => onPointerMove(p, obj);
        obj.scene.input.on("pointermove", func2);

        obj.once("destroy", () => {
            obj.scene.input.off("pointerdown", func1);
            obj.scene.input.off("pointermove", func2);
        });

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
    
    gameobj.vertices.forEach(ver => {
        const key = `x:${ver.tx};y:${ver.ty}`;
        const points = list.get(key);
    
        if (points) points.push(ver);
        else list.set(key, [ver]);
    });

    return [...list.values()];
}

function onPointerDown(pointer: Phaser.Input.Pointer, mesh: Phaser.GameObjects.Mesh) {
    const size = 10;
    
    const { x: x2, y: y2 } = pointer;

    (mesh as any)._point = (mesh as any)._points.find((p: any) => {
        const { tx: x, ty: y } = p[0];

        const onX = (x > x2 - size) && (x < x2 + size);
        const onY = (y > y2 - size) && (y < y2 + size);

        return onX && onY;
    });
}

let updateTrigger = false;
function onPointerMove(pointer: Phaser.Input.Pointer, mesh: Phaser.GameObjects.Mesh) {
    if (!pointer.isDown) return;
    if (!(mesh as any)._point) return;

    (mesh as any)._point.forEach((point: any) => {
        const offsetX = point.tx - pointer.x;
        const offsetY = point.ty - pointer.y;

        point.x -= offsetX / mesh.width;
        point.y += offsetY / mesh.height;
    });

    if (updateTrigger) {
        (mesh as any).rotateZ += 0.0000000001
    } else {
        (mesh as any).rotateZ -= 0.0000000001
    }

    updateTrigger = !updateTrigger;
}
