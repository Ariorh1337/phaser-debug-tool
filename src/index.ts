/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import overwriteEventEmitter from "./overwrite/EventEmitter";
import overwriteGame from "./overwrite/Game";

if(window.Phaser) {
    console.log("Phaser debug executed too late 😢 (ServiceWorker PreCache?)");
    window._Phaser = window.Phaser;
}

overwriteEventEmitter();

Object.defineProperty(window, "Phaser", {
    set(value) {
        if (value.VERSION.match(/2\.([0-9]*)\.([0-9]*)/)) {
            console.log("Phaser 2 unsupported 👴");
            window._Phaser = value;
            return;
        }

        let firstTime = !Boolean(window._Phaser);

        window._Phaser = value;

        if (firstTime) {
            console.log("Phaser debug is enabled 🪲");
            Phaser.Game = overwriteGame();
        }
    },
    get() {
        return window._Phaser;
    }
});
