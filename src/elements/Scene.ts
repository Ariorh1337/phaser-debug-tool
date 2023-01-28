import { addedToScene, hasProp, oldAddedToScene } from "../utils/extra";
import addCamera from "./Camera";

export default function addScene(pane: any, scene: Phaser.Scene) {
    const folder = pane.addFolder({
        title: `Scene "${scene.scene.key}"`,
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
        addState(folder, scene);
    }

    if (true) { // Childrens
        addChildren(folder, scene);
    }

    folder.addButton({ title: "Declare as: window.scene" }).on("click", () => {
        window.scene = scene;
    });
}

function addState(folder: any, scene: Phaser.Scene) {
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

function addChildren(folder: any, scene: Phaser.Scene) {
    const childrenFolder = folder.addFolder({
        title: "Children",
        expanded: false,
    });

    oldAddedToScene(childrenFolder, scene);

    scene.events.on("addedtoscene", (gameObject: any) => {
        addedToScene(childrenFolder, gameObject);
    });

    scene.events.on("shutdown", () => {
        childrenFolder.children.forEach((a: any) => a.dispose());
    });

    scene.events.on("create", () => {
        const list = scene.children.list.filter(gameobj => {
            return (!hasProp(gameobj, "parentContainer"));
        });

        list.forEach((gameobj: any) => {
            addedToScene(childrenFolder, gameobj);
        });
    });
}
