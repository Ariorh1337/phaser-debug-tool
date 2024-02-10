/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import DebugWidget from './DebugWidget/index';

function debug() {
    const widget = new DebugWidget();

    const debug = widget.addFloatingContainer({
        title: 'Debug',
        right: 0,
        top: 0,
    });

    const test = {
        number: 123,
        text: 'Hello, World!',
        boolean: true,
    };

    debug.addInput({
        title: 'Num:',
        property: 'number',
        target: test,
    });

    debug.addInput({
        title: 'Text:',
        property: 'text',
        target: test,
    });

    debug.addInput({
        title: 'Bool:',
        property: 'boolean',
        target: test,
    });

    const container = debug.addContainer({
        title: 'Container',
    });

    container.addInput({
        title: 'Num:',
        property: 'number',
        target: test,
    });

    console.log({ widget, debug, test });
}

if(window.Phaser) {
    console.log("Phaser debug executed too late 😢 (ServiceWorker PreCache?)");
    window._Phaser = window.Phaser;
}

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