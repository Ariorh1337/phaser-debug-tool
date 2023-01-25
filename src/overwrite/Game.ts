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

                game.scene.scenes.forEach((scene, i) => {
                    addScene(folder, scene);
                });

                folder.addButton({ title: "Declare as: window.game" }).on("click", () => {
                    window.game = game;
                });
    
                postBoot(game);
            };
    
            super(GameConfig);
        }
    }

    return Game;
}
