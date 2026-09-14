import addScene from "../elements/Scene";
import * as Tweakpane from "../tweakpane";
import { DESTROY } from "../utils/phaser";

var mainPane: Tweakpane.Pane | undefined;
var postfix = (() => {
    let index = 0;

    return () => {
        index++;

        return index === 1 ? "" : ` #${index}`;
    };
})();

/**
 * Attaches the debug panel to a `Phaser.Game` instance.
 *
 * The interceptor hands the instance over while the `Game` constructor is still running, so the
 * panel is built inside `postBoot` (renderer ready, scenes queued), exactly like the former
 * `Phaser.Game` subclass did. A game that is already running is attached immediately.
 */
export default function attachGame(game: Phaser.Game) {
    const target = game as any;

    if (target._pane || target.__phaserDebugQueued) {
        console.log("Phaser debug: 🤯 already attached");
        return;
    }

    target.__phaserDebugQueued = true;

    if (game.isRunning) {
        setup(game);
        return;
    }

    const config = game.config as any;
    const postBoot = typeof config.postBoot === "function" ? config.postBoot : () => {};

    config.postBoot = function (this: any, booted: Phaser.Game) {
        setup(booted || game);

        return postBoot.call(this, booted);
    };
}

function setup(game: Phaser.Game) {
    console.log("Phaser debug: 🔍 attached");

    if ((game as any)._pane) {
        console.log("Phaser debug: 🤯 already attached (multiple Game.postBoot execution)");
        return;
    }

    if (!mainPane) {
        mainPane = new Tweakpane.Pane();
        applyCustomStyleToPane(mainPane);
    }

    const folder = (mainPane as any).addFolder({
        title: `Debug${postfix()}`,
        expanded: false,
    });

    (game as any)._tweakpane = mainPane;
    (game as any)._pane = folder;

    game.events.once(DESTROY, () => {
        console.log("Phaser debug: 🗑️ game destroyed");
        folder.dispose();
    });

    addFpsMonitor(folder, game);

    const scenesFolder = folder.addFolder({
        title: `Scenes`,
        expanded: true,
    });

    game.scene.scenes.forEach((scene) => {
        addScene(scenesFolder, scene);
    });

    const method = game.scene.add.bind(game.scene);
    game.scene.add = function (
        key: string,
        scene: Phaser.Scene,
        autoStart: boolean
    ) {
        const obj = method(key, scene, autoStart);

        if (obj) {
            addScene(scenesFolder, obj);
        } else {
            console.error(`🪲 Failed to add scene "${key}"`);
        }

        return obj;
    };

    folder
        .addButton({ title: "Declare as: window.game" })
        .on("click", () => {
            window.game = game;
        });
}

function addFpsMonitor(folder: any, game: Phaser.Game) {
    const FPS_SCALE_STEP = 30;
    const FPS_SCALE_HEADROOM = FPS_SCALE_STEP;
    const FPS_SCALE_FLOOR = 2 * FPS_SCALE_STEP;
    const FPS_SCALE_TOLERANCE = FPS_SCALE_STEP / 4;

    const monitor = folder.addMonitor(game.loop, "actualFps", {
        view: "graph",
        min: 0,
        max: FPS_SCALE_FLOOR,
        label: "FPS",
    });

    const graph = monitor.controller_?.valueController;
    const props = graph?.props_;

    if (!graph || !props || typeof props.set !== "function") {
        return monitor;
    }

    monitor.on("update", () => {
        const buffer: (number | undefined)[] = graph.value.rawValue;

        let peak = 0;
        for (const v of buffer) {
            if (typeof v === "number" && v > peak) peak = v;
        }

        const snapped = Math.ceil((peak - FPS_SCALE_TOLERANCE) / FPS_SCALE_STEP) * FPS_SCALE_STEP;
        const max = Math.max(FPS_SCALE_FLOOR, snapped + FPS_SCALE_HEADROOM);

        if (props.get("maxValue") !== max) {
            props.set("maxValue", max);
        }
    });

    return monitor;
}

function applyCustomStyleToPane(pane: any) {
    const element = pane.containerElem_;

    element.setAttribute("id", "tweenpane_phaser_debug");

    const style = document.createElement("style");
    document.head.append(style);
    style.innerHTML = `
    #tweenpane_phaser_debug {
        width: auto;
        min-width: max-content;
        overflow: hidden auto;
        max-height: ${window.innerHeight - 20}px;
        resize: vertical;
        z-index: 9999;
    }

    #tweenpane_phaser_debug::-webkit-scrollbar {
        width: 0.5em;
    }

    #tweenpane_phaser_debug::-webkit-scrollbar-track {
        background: #37383d;
        border-radius: 7px;
    }

    #tweenpane_phaser_debug::-webkit-scrollbar-thumb {
        background: #202125;
        border-radius: 7px;
    }

    /* Firefox has no ::-webkit-scrollbar; use the standard properties there only,
       Chromium would otherwise drop the custom scrollbar above in favour of these. */
    @supports (-moz-appearance: none) {
        #tweenpane_phaser_debug,
        #tweenpane_phaser_debug .tp-fldv > .tp-fldv_c {
            scrollbar-width: thin;
            scrollbar-color: #202125 #37383d;
        }
    }
    `;

    const elm = document.querySelector(
        ".tp-rotv > .tp-rotv_c > .tp-fldv > .tp-fldv_c"
    );
    if (elm) {
        (elm as HTMLElement).style.resize = "none";
        (elm as HTMLElement).style.overflowY = "hidden !important";
    }

    let offsetX = 0;
    let offsetY = 0;
    let movePane = false;
    let moveStart = new Date().getTime();
    let movedOnce = false;

    element.addEventListener("pointerdown", (event: any) => {
        if (event.target.innerHTML !== "Debug") return;

        const { x, y } = event;
        const { top, left } = element.getBoundingClientRect();

        offsetX = left - x;
        offsetY = top - y;
        movePane = true;
        moveStart = new Date().getTime() + 200;
    });

    document.body.addEventListener("pointermove", (event: any) => {
        if (!movePane) return;
        if (moveStart > new Date().getTime()) return;

        movedOnce = true;

        const { x, y } = event;
        const [targetX, targetY] = [x + offsetX, y + offsetY];

        if (targetY > 0 && targetY < innerHeight - 20) {
            element.style.top = `${targetY}px`;

            const { top, height } = element.getBoundingClientRect();
            if (top + height > innerHeight) {
                element.style.height = `${innerHeight - top - 20}px`;
            }
        }

        if (targetX > 0) {
            element.style.left = `${targetX}px`;
        }

        element.style.right = "auto";
    });

    document.body.addEventListener("pointerup", (event: any) => {
        if (!movePane) return;

        movePane = false;

        if (movedOnce) {
            movedOnce = false;
            pane.children[0].controller_.onTitleClick_();
        }
    });
}
