import "phaser3_gui_inspector";
import LocalDebugs from "./utils/cheats";

declare var PhaserGUIAction: any;
declare var PhaserGUI: any;
declare var Phaser: any;

const search = setInterval(() => {
    try {
        if (!Phaser) return;

        document.dispatchEvent(new Event("phaser-debug"));
        clearInterval(search);
    } catch (e) {}
}, 1);

document.addEventListener("phaser-debug", () => {
    if (!Phaser) return console.error("Phaser is not defined");
    console.log("Phaser debug is enabled");

    const debugs = new LocalDebugs();

    // @ts-ignore
    class Game extends Phaser.Game {
        constructor(config: any) {
            const callbacks = config.callbacks || {};
            const postBoot = callbacks.postBoot || (() => {});

            callbacks.postBoot = (game: any) => {
                const scenes = new Map();

                game.scene.scenes.forEach((scene: any) => {
                    scenes.set(scene.scene.key, scene);

                    debugs.addButton(scene.scene.key, () => {
                        debugs.kill();

                        PhaserGUIAction(scene);

                        PhaserGUI.destroyGUI = function () {
                            PhaserGUI.GUI.lib.destroyGUI();
                        };
                    });
                });

                (window as any).PhaserDebugExt = {
                    game: game,
                    scenes: scenes,
                };

                postBoot(game);
            };
            config.callbacks = callbacks;

            super(config);
        }
    }
    Phaser.Game = Game;
});
