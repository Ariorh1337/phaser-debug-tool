import createSceneFolder from "./Scene";
import * as Tweakpane from "./tweakpane";

export default function getGame() {
    class Game extends Phaser.Game {
        static DebugToolInterval: NodeJS.Timer | undefined;

        constructor(config: Phaser.Types.Core.GameConfig) {
            const callbacks = config.callbacks || {};
            const postBoot = callbacks.postBoot || (() => {});

            callbacks.postBoot = (game: Phaser.Game) => {
                console.log("Phaser debug is attached");

                const pane = new Tweakpane.Pane() as any;
                pane.containerElem_.style.width = "auto";
                pane.containerElem_.style.minWidth = "fit-content";
                pane.containerElem_.style.overflow = "hidden auto";
                pane.containerElem_.style.maxHeight = `${window.innerHeight - 20}px`;

                const folder = pane.addFolder({
                    title: `Debug`,
                    expanded: false,
                });

                folder.addMonitor(game.loop, "actualFps", {
                    view: "graph",
                    min: 0,
                    max: 120,
                    label: "FPS",
                });

                game.scene.scenes.forEach((scene) => {
                    createSceneFolder(folder, scene);
                });

                folder.addButton({ title: "Declare as: window.game" }).on("click", () => {
                    (window as any).game = game;
                });

                postBoot(game);
            };

            config.callbacks = callbacks;

            super(config);
        }
    }

    return Game;
}
