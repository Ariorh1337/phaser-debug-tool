/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import overwriteGame from "./overwrite/Game";

Object.defineProperty(window, "Phaser", {
    set(value) {
        let firstTmie = !Boolean(window._Phaser);

        window._Phaser = value;

        if (firstTmie) {
            console.log("Phaser debug is enabled");
            Phaser.Game = overwriteGame();
        }
    },
    get() {
        return window._Phaser;
    }
}); 
