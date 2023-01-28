import addGameObject from "../elements/GameObject";
import { gameObjList } from "./globals";

export function hasProp(obj: any, key: string) {
    return obj[key] !== undefined && obj[key] !== null;
}

export function addedToScene(folder: any, gameObject: any) {
    gameObjList.add(gameObject);
    addGameObject(folder, gameObject);
    return gameObject;
}

export function oldAddedToScene(folder: any, scene: Phaser.Scene) {
    Object.keys(Object.getPrototypeOf(scene.add)).forEach(
        (methodName: string) => {
            if (["boot", "start", "shutdown", "destroy"].includes(methodName)) return;

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
