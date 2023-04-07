import addGameObject from "../elements/GameObject";
import { gameObjList } from "./globals";
import { eye_off, eye_on, move } from "./svg";

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
            if (["boot", "start", "shutdown", "destroy", "tween"].includes(methodName)) return;

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
        }

        const physicsExisting = scene.physics.add.existing;
        // @ts-ignore
        scene.physics.add.existing = function (...args: any[]) {
            const obj = physicsExisting.apply(this, args as any);
            return addedToScene(folder, obj);
        }
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
        Phaser.Math.Between(20, 40)
    ];

    folder.element.style.backgroundColor = `rgb(${rnd[0]}, ${rnd[1]}, ${rnd[2]})`;

    // ---

    const drag = document.createElement("div");
    const place1 = folder.element.querySelector('div[name="place1"]');
    place1.appendChild(drag);

    drag.innerHTML = move;
    drag.setAttribute("draggable", "true");
    drag.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', (obj as any).DebugID);
    });

    // ---

    const visible = document.createElement("div");
    const place2 = folder.element.querySelector('div[name="place2"]');
    place2.appendChild(visible);

    visible.innerHTML = obj.visible ? eye_off : eye_on;
    visible.addEventListener("click", () => {
        obj.visible = !obj.visible;
        visible.innerHTML = obj.visible ? eye_off : eye_on;
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

    folder.element.addEventListener('drop', (e: any) => {
        if (e.target !== folder.controller_.view.titleElement) return;

        e.preventDefault();

        const draggedElementId = e.dataTransfer.getData('text/plain');
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
