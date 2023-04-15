import {
    addedToScene,
    hasProp,
    isVisible,
    oldAddedToScene,
} from "../utils/extra";
import { gameObjList } from "../utils/globals";
import addCamera from "./Camera";

export default function addScene(pane: any, scene: Phaser.Scene) {
    const folder = pane.addFolder({
        title: `Scene "${scene.scene.key}"`,
        expanded: false,
    });

    scene.events.on("destroy", () => folder.dispose);

    if (scene.load) {
        // Load
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

    if (true) {
        // Camera
        addCamera(folder, scene.cameras.main, {
            title: "Default Camera",
            expanded: false,
        });
    }

    if (true) {
        // State
        addState(folder, scene);
    }

    if (true) {
        // Childrens
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
                case 0:
                    return "PENDING";
                case 1:
                    return "INIT";
                case 2:
                    return "START";
                case 3:
                    return "LOADING";
                case 4:
                    return "CREATING";
                case 5:
                    return "RUNNING";
                case 6:
                    return "PAUSED";
                case 7:
                    return "SLEEPING";
                case 8:
                    return "SHUTDOWN";
                case 9:
                    return "DESTROYED";
                default:
                    return "UNKNOWN";
            }
        },
    });

    stateFolder
        .addButton({ title: "Pause" })
        .on("click", () => scene.scene.pause());
    stateFolder
        .addButton({ title: "Resume" })
        .on("click", () => scene.scene.resume());
    stateFolder
        .addButton({ title: "Sleep" })
        .on("click", () => scene.scene.sleep());
    stateFolder
        .addButton({ title: "Wake" })
        .on("click", () => scene.scene.wake());
    stateFolder
        .addButton({ title: "Stop" })
        .on("click", () => scene.scene.stop());
    stateFolder
        .addButton({ title: "Restart" })
        .on("click", () => scene.scene.restart());
    stateFolder
        .addButton({ title: "Remove" })
        .on("click", () => scene.scene.remove());
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

    folder.element.addEventListener("drop", (e: any) => {
        if (e.target !== childrenFolder.controller_.view.titleElement) return;

        e.preventDefault();

        const draggedElementId = e.dataTransfer.getData("text/plain");
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
        const list = scene.children.list.filter((gameobj) => {
            return !hasProp(gameobj, "parentContainer");
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

    // ---

    const row = searchFolder.addRow();

    const searchBtn = row.addButton({
        title: 'search',
        width: '75px',
    });

    const searchInput = row.addInput({ value: "" }, "value", { width: '150px' });

    // ---

    let enabled = false;
    const btn = searchFolder.addButton({ title: "Click to Search" });
    function updateBtn(enabled: boolean) {
        const color = enabled ? "#5fa770" : "";
        const elm = btn.controller_.view.valueElement.firstChild.firstChild;
        elm.style.backgroundColor = color;
    }

    // ---

    const resultFolder = searchFolder.addFolder({
        title: "Result",
        expanded: false,
    });

    let searchResult = [] as any[];

    resultFolder.controller_.on("close", () => {
        searchResult.forEach((a: any) => a());
        searchResult = [];
    });

    // --- 

    btn.on("click", () => {
        updateBtn((enabled = !enabled));

        let input_enabled = scene.input.enabled;
        scene.input.enabled = false;

        function click() {
            scene.input.activePointer.updateWorldPoint(
                scene.input.activePointer.camera || scene.cameras.main
            );
            const { worldX, worldY } = scene.input.activePointer;

            updateBtn((enabled = !enabled));
            searchResult = addSearchResult(
                resultFolder,
                searchVector({ worldX, worldY }, scene)
            );
            resultFolder.controller_.open();
            setTimeout(() => (scene.input.enabled = input_enabled), 500);

            scene.game.canvas.removeEventListener("click", click);
        }

        if (enabled) {
            scene.game.canvas.addEventListener("click", click);
        } else {
            scene.game.canvas.removeEventListener("click", click);
            setTimeout(() => (scene.input.enabled = input_enabled), 500);
        }

        searchResult.forEach((a: any) => a());
        searchResult = [];
    });

    searchBtn.on("click", () => {
        searchResult.forEach((a: any) => a());
        searchResult = [];

        if (!searchInput.value) return;

        searchResult = addSearchResult(
            resultFolder,
            searchName({ name: searchInput.value }, scene)
        );
        resultFolder.controller_.open();
    });
}

function searchVector(event: any, scene: Phaser.Scene) {
    const { worldX, worldY } = event;

    const result = Object.values(gameObjList.list).filter((obj) => {
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

        return Phaser.Geom.Rectangle.ContainsPoint(p, {
            x: worldX,
            y: worldY,
        } as any);
    });

    return result;
}

function searchName(event: any, scene: Phaser.Scene) {
    const { name } = event;

    const result = Object.values(gameObjList.list).filter((obj) => {
        if (obj.scene !== scene) return false;
        if (!isVisible(obj)) return false;

        return obj.name === name;
    });

    return result;
}

function addSearchResult(folder: any, objs: any): (() => void)[] {
    return objs.map((obj: any) => {
        const fakeFolder = folder.addFolder({
            title: obj._pane.title,
            expanded: false,
        });

        fakeFolder.controller_.on("open", () => {
            fakeFolder.controller_.close();

            const objParent = obj._pane.parent;
            const objElm = obj._pane.element;

            const fakeParent = fakeFolder.parent;
            const fakeElm = fakeFolder.element;
            const fakeContainer = fakeParent.controller_.view.containerElement;

            const temp = document.createElement("div");

            if (fakeContainer.contains(fakeElm)) {
                fakeContainer.insertBefore(temp, fakeElm);
                fakeFolder.movePaneTo(objParent, objElm);
                obj._pane.movePaneTo(fakeParent, temp);
            } else {
                fakeContainer.insertBefore(temp, objElm);
                obj._pane.movePaneTo(objParent, fakeElm);
                fakeFolder.movePaneTo(fakeParent, temp);
            }

            temp.remove();

            obj._pane.controller_.open();
        });

        const objParent = obj._pane.parent;

        const fakeParent = fakeFolder.parent;
        const fakeElm = fakeFolder.element;
        const fakeContainer = fakeParent.controller_.view.containerElement;

        return function () {
            obj._pane.controller_.close();

            if (!fakeContainer.contains(fakeElm)) {
                obj._pane.movePaneTo(objParent, fakeElm);
            }

            fakeFolder.dispose();
        };
    });
}
