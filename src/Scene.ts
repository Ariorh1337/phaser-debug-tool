import addCamera from "./elements/Camera";
import addGameObject from "./elements/GameObject";
import { addedToScene, oldAddedToScene } from "./utils/extra";

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

        const DebugScene = new Map();

        oldAddedToScene(scene, DebugScene);

        scene.events.on("addedtoscene", (gameObject: any) => {
            addedToScene(DebugScene, gameObject);
        });

        scene.events.once("create", function () {
            scene.events.once("update", function () {
                DebugScene.forEach((gameObject: any) => {
                    if (!gameObject.scene) return;
                    addGameObject(childrenFolder, gameObject)
                });
            });
        });
    }

    folder.addButton({ title: "Declare as: window.scene" }).on("click", () => {
        (window as any).scene = scene;
    });
}
