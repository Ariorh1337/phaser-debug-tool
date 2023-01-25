export function hasProp(obj: any, key: string) {
    return obj[key] !== undefined && obj[key] !== null;
}

export function addedToScene(DebugScene: any, gameObject: any) {
    const DebugID = gameObject.DebugID || crypto.randomUUID();
    gameObject.DebugID = DebugID;
    DebugScene.set(DebugID, gameObject);
}

export function oldAddedToScene(scene: Phaser.Scene, DebugScene: any) {
    Object.keys(Object.getPrototypeOf(scene.add)).forEach(
        (methodName: string) => {
            if (["boot", "start", "shutdown", "destroy"].includes(methodName)) return;

            const method = (scene.add as any)[methodName];
            (scene.add as any)[methodName] = function (...args: any[]) {
                const obj = method.apply(this, args as any);
                addedToScene(DebugScene, obj);
                return obj;
            };
        }
    );

    const physicsSprite = scene.physics.add.sprite;
    scene.physics.add.sprite = function (...args: any[]) {
        const obj = physicsSprite.apply(this, args as any);
        addedToScene(DebugScene, obj);
        return obj;
    };

    const physicsImage = scene.physics.add.image;
    scene.physics.add.image = function (...args: any[]) {
        const obj = physicsImage.apply(this, args as any);
        addedToScene(DebugScene, obj);
        return obj;
    }

    const physicsExisting = scene.physics.add.existing;
    // @ts-ignore
    scene.physics.add.existing = function (...args: any[]) {
        const obj = physicsExisting.apply(this, args as any);
        addedToScene(DebugScene, obj);
        return obj;
    }
}
