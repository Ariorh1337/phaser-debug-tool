import addGameObject from "../elements/GameObject";
import { gameObjList } from "./globals";
import { eye_off, eye_on, move, print } from "./svg";

export function hasProp(obj: any, key: string) {
    return obj[key] !== undefined && obj[key] !== null;
}

export function addedToScene(folder: any, gameObject: any) {
    if (gameObject._pane) {
        gameObject._pane.movePaneTo(folder);
        return gameObject;
    }

    gameObjList.add(gameObject);
    addGameObject(folder, gameObject);
    return gameObject;
}

export function oldAddedToScene(folder: any, scene: Phaser.Scene) {
    Object.keys(Object.getPrototypeOf(scene.add)).forEach(
        (methodName: string) => {
            if (
                ["boot", "start", "shutdown", "destroy", "tween"].includes(
                    methodName
                )
            )
                return;

            const method = (scene.add as any)[methodName];
            (scene.add as any)[methodName] = function (...args: any[]) {
                const obj = method.apply(this, args as any);
                return addedToScene(folder, obj);
            };
        }
    );

    if (scene.physics) {
        const physicsSprite = scene.physics.add.sprite;
        scene.physics.add.sprite = function (...args: any[]) {
            const obj = physicsSprite.apply(this, args as any);
            return addedToScene(folder, obj);
        };

        const physicsImage = scene.physics.add.image;
        scene.physics.add.image = function (...args: any[]) {
            const obj = physicsImage.apply(this, args as any);
            return addedToScene(folder, obj);
        };

        const physicsExisting = scene.physics.add.existing;
        // @ts-ignore
        scene.physics.add.existing = function (...args: any[]) {
            const obj = physicsExisting.apply(this, args as any);
            return addedToScene(folder, obj);
        };
    }
}

export function addGameObjectFolder(pane: any, options: any, obj: any) {
    const folder = pane.addFolder(options);
    folder.element.id = (obj as any).DebugID;
    (obj as any)._pane = folder;

    // --- colorful folder

    const rnd = [
        Phaser.Math.Between(20, 40),
        Phaser.Math.Between(20, 40),
        Phaser.Math.Between(20, 40),
    ];

    folder.element.style.backgroundColor = `rgb(${rnd[0]}, ${rnd[1]}, ${rnd[2]})`;

    // ---

    const printElm = document.createElement("div");
    const place1 = folder.element.querySelector('div[name="place1"]');
    place1.appendChild(printElm);

    printElm.innerHTML = print;
    printElm.addEventListener("click", () => {
        console.log(objToString(obj));
    });

    // ---

    const drag = document.createElement("div");
    const place2 = folder.element.querySelector('div[name="place2"]');
    place2.appendChild(drag);

    drag.innerHTML = move;
    drag.setAttribute("draggable", "true");
    drag.addEventListener("dragstart", (e) => {
        e.dataTransfer?.setData("text/plain", (obj as any).DebugID);
    });

    // ---

    const visible = document.createElement("div");
    const place3 = folder.element.querySelector('div[name="place3"]');
    place3.appendChild(visible);

    visible.innerHTML = obj.visible ? eye_on : eye_off;
    visible.addEventListener("click", () => {
        obj.visible = !obj.visible;
        visible.innerHTML = obj.visible ? eye_on : eye_off;
    });

    // ---

    const point = folder.element.querySelector('div[name="point"]');
    point.style.display = "none";

    // ---

    return folder;
}

export function addChildrenFolder(pane: any, options: any, obj: any) {
    const folder = pane.addFolder(options);
    (obj as any)._paneChild = folder;

    // ---

    folder.element.addEventListener("dragover", (e: any) => {
        e.preventDefault();
    });

    // ---

    folder.element.addEventListener("drop", (e: any) => {
        if (e.target !== folder.controller_.view.titleElement) return;

        e.preventDefault();

        const draggedElementId = e.dataTransfer.getData("text/plain");
        if (draggedElementId === (obj as any).DebugID) return;

        try {
            obj.add(gameObjList.get(draggedElementId));
        } catch (e) {
            console.error(e);
        }
    });

    // ---

    return folder;
}

export function isVisible(gameobj: any) {
    let element = gameobj,
        visible = true;

    do {
        visible = element.visible;
        element = element.parentContainer;
    } while (visible && Boolean(element));

    return visible;
}

function objToString(gameobj: any) {
    const camera = gameobj.scene.cameras.main;

    const result = [];

    const { name } = gameobj;
    if (name) result.push(`name: "${name}",`);

    const { x } = gameobj;
    if (x) result.push(`x: ${x}, // ${x / camera.width},`);

    const { y } = gameobj;
    if (y) result.push(`y: ${y}, // ${y / camera.height},`);

    const { alpha } = gameobj;
    if (alpha !== 1) result.push(`alpha: ${alpha},`);

    const { angle } = gameobj;
    if (angle) result.push(`angle: ${angle},`);

    const { rotation } = gameobj;
    if (rotation) result.push(`rotation: ${rotation},`);

    const { originX, originY } = gameobj;
    if (originX !== 0.5 || originY !== 0.5) {
        result.push(`origin: { x: ${originX}, y: ${originY} },`);
    }

    const { scaleX, scaleY } = gameobj;
    if (scaleX !== 1 || scaleY !== 1) {
        result.push(`scale: { x: ${scaleX}, y: ${scaleY} },`);
    }

    const { texture, frame } = gameobj;
    if (texture && texture.key) result.push(`key: "${texture.key}",`);
    if (frame && frame.name && !frame.name.includes("__BASE")) result.push(`frame: "${frame.name}",`);

    const { skeletonKey } = gameobj;
    if (skeletonKey) result.push(`skeleton: "${skeletonKey}",`);

    const { flipX, flipY } = gameobj;
    if (flipX) result.push(`flipX: ${flipX},`);
    if (flipY) result.push(`flipY: ${flipY},`);

    const { text } = gameobj;
    if (text) result.push(`text: "${text}",`);

    const { style } = gameobj;
    if (style) result.push(`style: ${JSON.stringify(style, undefined, 8)},`);

    const { _crop } = gameobj;
    if (_crop) {
        if (_crop.x !== 0 || _crop.y !== 0 || _crop.width !== 0 || _crop.height !== 0) {
            if (_crop.width !== gameobj.width || _crop.height !== gameobj.height) {
                result.push(`crop: { x: ${_crop.x}, y: ${_crop.y}, width: ${_crop.width}, height: ${_crop.height} },`);
            }
        }
    }

    const { depth } = gameobj;
    if (depth) result.push(`depth: ${depth},`);

    const { visible } = gameobj;
    if (!visible) result.push(`visible: ${visible},`);

    return "{\n    " + result.join("\n    ") + "    \n}";
}