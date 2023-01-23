import addCamera from "./elements/Camera";
import addGameObject from "./elements/GameObject";

export default function createSceneFolder(pane: any, scene: Phaser.Scene) {
    const folder = pane.addFolder({
        title: `Scene “${scene.scene.key}”`,
        expanded: false,
    });

    scene.events.on("destroy", () => folder.dispose);

    if (scene.load) { // Load
        const loadFolder = folder.addFolder({ title: "Load", expanded: false });
        loadFolder.addMonitor(scene.load, "progress", {
            view: "graph",
            min: 0,
            max: 1,
        });
        loadFolder.addMonitor(scene.load, "totalComplete");
        loadFolder.addMonitor(scene.load, "totalFailed");
        loadFolder.addMonitor(scene.load, "totalToLoad");
    }

    if (true) { // Camera
        addCamera(folder, scene.cameras.main, {
            title: "Default Camera",
            expanded: false,
        });
    }

    if (true) { // State
        const stateFolder = folder.addFolder({
            title: "State",
            expanded: false,
        });

        stateFolder.addMonitor(scene.scene.settings, "active");
        stateFolder.addMonitor(scene.scene.settings, "visible");
        stateFolder.addMonitor(scene.scene.settings, "status", {
            format: (value: any) => {
                switch (value) {
                    case 0: return "PENDING";
                    case 1: return "INIT";
                    case 2: return "START";
                    case 3: return "LOADING";
                    case 4: return "CREATING";
                    case 5: return "RUNNING";
                    case 6: return "PAUSED";
                    case 7: return "SLEEPING";
                    case 8: return "SHUTDOWN";
                    case 9: return "DESTROYED";
                    default: return "UNKNOWN";
                }
            },
        });

        stateFolder.addButton({ title: "Pause" }).on("click", () => scene.scene.pause());
        stateFolder.addButton({ title: "Resume" }).on("click", () => scene.scene.resume());
        stateFolder.addButton({ title: "Sleep" }).on("click", () => scene.scene.sleep());
        stateFolder.addButton({ title: "Wake" }).on("click", () => scene.scene.wake());
        stateFolder.addButton({ title: "Stop" }).on("click", () => scene.scene.stop());
        stateFolder.addButton({ title: "Restart" }).on("click", () => scene.scene.restart());
        stateFolder.addButton({ title: "Remove" }).on("click", () => scene.scene.remove());
    }

    if (true) { // Childrens
        const childrenFolder = folder.addFolder({
            title: "Children",
            expanded: false,
        });

        scene.events.on("addedtoscene", function (gameObject: any) {
            addGameObject(childrenFolder, gameObject);
        });

        const container = Phaser.GameObjects.Container;
        Phaser.GameObjects.Container = class Container extends container {
            constructor(...args: any[]) {
                // @ts-ignore
                super(...args);
                addGameObject(childrenFolder, this);
            }
        };


        if (!Phaser.GameObjects.Events.ADDED_TO_SCENE) {
            const time = 1;

            const addArc = scene.add.arc;
            scene.add.arc = function (...args: any[]) {
                const obj = addArc.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addBitmapText = scene.add.bitmapText;
            scene.add.bitmapText = function (...args: any[]) {
                const obj = addBitmapText.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addCircle = scene.add.circle;
            scene.add.circle = function (...args: any[]) {
                const obj = addCircle.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addContainer = scene.add.container;
            scene.add.container = function (...args: any[]) {
                const obj = addContainer.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addDynamicBitmapText = scene.add.dynamicBitmapText;
            scene.add.dynamicBitmapText = function (...args: any[]) {
                const obj = addDynamicBitmapText.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addEllipse = scene.add.ellipse;
            scene.add.ellipse = function (...args: any[]) {
                const obj = addEllipse.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addGraphics = scene.add.graphics;
            scene.add.graphics = function (...args: any[]) {
                const obj = addGraphics.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addImage = scene.add.image;
            scene.add.image = function (...args: any[]) {
                const obj = addImage.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addLine = scene.add.line;
            scene.add.line = function (...args: any[]) {
                const obj = addLine.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addMesh = scene.add.mesh;
            scene.add.mesh = function (...args: any[]) {
                const obj = addMesh.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addParticleEmitter = scene.add.particles;
            scene.add.particles = function (...args: any[]) {
                const obj = addParticleEmitter.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addPath = scene.add.path;
            scene.add.path = function (...args: any[]) {
                const obj = addPath.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj as any), time);
                return obj;
            }

            const addPolygon = scene.add.polygon;
            scene.add.polygon = function (...args: any[]) {
                const obj = addPolygon.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addRectangle = scene.add.rectangle;
            scene.add.rectangle = function (...args: any[]) {
                const obj = addRectangle.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addRenderTexture = scene.add.renderTexture;
            scene.add.renderTexture = function (...args: any[]) {
                const obj = addRenderTexture.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addRope = scene.add.rope;
            scene.add.rope = function (...args: any[]) {
                const obj = addRope.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addSprite = scene.add.sprite;
            scene.add.sprite = function (...args: any[]) {
                const obj = addSprite.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addText = scene.add.text;
            scene.add.text = function (...args: any[]) {
                const obj = addText.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addTileSprite = scene.add.tileSprite;
            scene.add.tileSprite = function (...args: any[]) {
                const obj = addTileSprite.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addZone = scene.add.zone;
            scene.add.zone = function (...args: any[]) {
                const obj = addZone.apply(this, args as any);
                setTimeout(() => addGameObject(childrenFolder, obj), time);
                return obj;
            }

            const addSpine = (scene.add as any).spine;
            if (addSpine) {
                (scene.add as any).spine = function (...args: any[]) {
                    const obj = addSpine.apply(this, args as any);
                    setTimeout(() => addGameObject(childrenFolder, obj), time);
                    return obj;
                }
            }
        }
    }

    folder.addButton({ title: "Declare as: window.scene" }).on("click", () => {
        (window as any).scene = scene;
    });
}
