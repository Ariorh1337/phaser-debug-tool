import addScene from "../elements/Scene";
import * as Tweakpane from "../tweakpane";
import { addEvent } from "./EventEmitter";

var oldPane: Tweakpane.Pane | undefined;

export default function overwriteGame() {
    class Game extends Phaser.Game {
        constructor(GameConfig?: Phaser.Types.Core.GameConfig) {
            GameConfig ||= {};
            GameConfig.callbacks ||= {};
            GameConfig.callbacks.postBoot ||= () => { };
            
            console.dir(Phaser.Events.EventEmitter);

            const postBoot = GameConfig.callbacks.postBoot;

            GameConfig.callbacks.postBoot = (game: Phaser.Game) => {
                console.log("Phaser debug is attached 🔍");

                const pane = new Tweakpane.Pane() as any;

                const folder = pane.addFolder({
                    title: `Debug`,
                    expanded: false,
                });

                (game as any)._tweakpane = pane;
                (game as any)._pane = folder;

                if (oldPane) {
                    (oldPane as any).remove(oldPane)
                    oldPane.element.remove();
                }
                oldPane = pane;

                applyCustomStyleToPane(pane);

                folder.addMonitor(game.loop, "actualFps", {
                    view: "graph",
                    min: 0,
                    max: 120,
                    label: "FPS",
                });

                const eventsFolder = folder.addFolder({
                    title: `Events`,
                    expanded: false,
                });
                addEvent(eventsFolder);

                const scenesFolder = folder.addFolder({
                    title: `Scenes`,
                    expanded: true,
                });

                game.scene.scenes.forEach((scene, i) => {
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

                postBoot(game);
            };

            super(GameConfig);
        }

        static call(context: any, GameConfig?: Phaser.Types.Core.GameConfig) {
            return new Game(GameConfig);
        }
    }

    return Game;
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
