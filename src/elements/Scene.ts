import { addedToScene, hasProp, isVisible, oldAddedToScene } from "../utils/extra";
import { gameObjList } from "../utils/globals";
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

    if (true) {
        addSearch(folder, scene);
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

    // ---

    childrenFolder.element.addEventListener("dragover", (e: any) => {
        e.preventDefault();
    });

    // ---

    folder.element.addEventListener('drop', (e: any) => {
        if (e.target !== childrenFolder.controller_.view.titleElement) return;

        e.preventDefault();

        const draggedElementId = e.dataTransfer.getData('text/plain');
        scene.add.existing(gameObjList.get(draggedElementId));
    });

    // ---

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

function addSearch(folder: any, scene: Phaser.Scene) {
    const searchFolder = folder.addFolder({
        title: "Search",
        expanded: false,
    });

    let enabled = false;
    const btn = searchFolder.addButton({ title: "Click to Seatch" });
    function updateBtn(enabled: boolean) {
        const color = enabled ? "#5fa770" : "";
        const elm = btn.controller_.view.valueElement.firstChild.firstChild;
        elm.style.backgroundColor = color;
    }

    const resultFolder = searchFolder.addFolder({
        title: "Result",
        expanded: false,
    });

    let searchResult = [] as any[];

    resultFolder.controller_.on("close", () => {
        searchResult.forEach((a: any) => a());
        searchResult = [];
    });

    btn.on("click", () => {
        updateBtn(enabled = !enabled);

        if (enabled) {
            searchResult.forEach((a: any) => a());
            searchResult = [];

            scene.input.once("pointerdown", (event: any) => {
                let input_enabled = scene.input.enabled;
                scene.input.enabled = false;

                updateBtn(enabled = !enabled);
                searchResult = addSearchResult(resultFolder, search(event, scene));
                resultFolder.controller_.open();

                setTimeout(() => (scene.input.enabled = input_enabled), 500);
            })
        } else {
            scene.input.off("pointerdown", search);
        }
    });
}

function search(event: any, scene: Phaser.Scene) {
    const { worldX, worldY } = event;

    const result = Object.values(gameObjList.list).filter(obj => {
        if (obj.scene !== scene) return false;
        if (!isVisible(obj)) return false;

        const originX = obj.originX ?? 0.5;
        const originY = obj.originY ?? 0.5;

        const width = obj.width * obj.scaleX;
        const height = obj.height * obj.scaleY;

        const { tx, ty } = obj.getWorldTransformMatrix();

        const p = new Phaser.Geom.Rectangle(
            tx - width * originX,
            ty - height * originY,
            width,
            height
        );

        return Phaser.Geom.Rectangle.ContainsPoint(p, { x: worldX, y: worldY } as any)
    });

    return result;
}

function addSearchResult(folder: any, objs: any): (() => void)[] {
    return objs.map((obj: any) => {
        const fakeFolder = folder.addFolder({ title: obj._pane.title, expanded: false });

        fakeFolder.controller_.on("open", () => {
            fakeFolder.controller_.close();

            const originalParent = obj._pane.parent;
            const fakeParent = fakeFolder.parent;

            const temp = document.createElement("div");

            fakeParent.element.lastChild.insertBefore(temp, fakeFolder.element);
            fakeFolder.movePaneTo(originalParent, obj._pane.element);
            obj._pane.movePaneTo(fakeParent, temp);

            temp.remove();

            obj._pane.controller_.open();
        });

        const originalParent = obj._pane.parent;
        const fakeParent = fakeFolder.parent;

        return function () {
            obj._pane.controller_.close();
            obj._pane.movePaneTo(originalParent);
            fakeFolder.dispose();
        };
    });
}
