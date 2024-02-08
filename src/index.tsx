/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import DebugWidget from './DebugWidget/index';

function debug() {
    const widget = new DebugWidget();

    const debug = widget.addFloatingContainer({
        title: 'Debug',
        relativeX: 1,
        relativeY: -1,
    });

    console.log({ widget, debug });
}

// if(window.Phaser) {
//     console.log("Phaser debug executed too late 😢 (ServiceWorker PreCache?)");
//     window._Phaser = window.Phaser;
// }

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
            // Phaser.Game = overwriteGame();
            debug();
        }
    },
    get() {
        return window._Phaser;
    }
}); 