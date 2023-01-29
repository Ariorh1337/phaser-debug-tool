import addScene from "../elements/Scene";
import * as Tweakpane from "../tweakpane";

export default function overwriteGame() {
    class Game extends Phaser.Game {
        constructor(GameConfig?: Phaser.Types.Core.GameConfig) {
            GameConfig ||= {};
            GameConfig.callbacks ||= {};
            GameConfig.callbacks.postBoot ||= () => {};
    
            const postBoot = GameConfig.callbacks.postBoot;
    
            GameConfig.callbacks.postBoot = (game: Phaser.Game) => {
                console.log("Phaser debug is attached");

                const pane = new Tweakpane.Pane() as any;

                const folder = pane.addFolder({
                    title: `Debug`,
                    expanded: false,
                });

                applyCustomStyleToPane(pane);

                folder.addMonitor(game.loop, "actualFps", {
                    view: "graph",
                    min: 0,
                    max: 120,
                    label: "FPS",
                });

                const scenesFolder = folder.addFolder({
                    title: `Scenes`,
                    expanded: true,
                });

                game.scene.scenes.forEach((scene, i) => {
                    addScene(scenesFolder, scene);
                });

                const method = game.scene.add;
                game.scene.add = function (key: string, scene: Phaser.Scene, autoStart: boolean) {
                    const obj = method.call(game.scene, key, scene, autoStart);
                    addScene(scenesFolder, obj);
                    return obj;
                }

                folder.addButton({ title: "Declare as: window.game" }).on("click", () => {
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

    element.style.width = "auto";
    element.style.minWidth = "fit-content";
    element.style.overflow = "hidden auto";
    element.style.maxHeight = `${window.innerHeight - 20}px`;
    element.style.resize = "vertical";

    let offsetX = 0;
    let offsetY = 0;
    let movePane = false;
    let moveStart = new Date().getTime();
    let movedOnce = false;

    element.addEventListener("pointerdown", (event: any) => {
        if (event.target.innerHTML !== 'Debug') return;

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
        element.style.top = `${y + offsetY}px`;
        element.style.left = `${x + offsetX}px`;
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