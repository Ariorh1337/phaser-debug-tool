/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import getGame from "./Game";

const DebugToolInterval = setInterval(() => {
    try {
        if (!Phaser) return;

        document.dispatchEvent(new Event("phaser-debug"));

        clearInterval(DebugToolInterval);
    } catch (e) {}
}, 1);

document.addEventListener("phaser-debug", () => {
    if (!Phaser) return console.error("Phaser is not defined");

    console.log("Phaser debug is enabled");

    Phaser.Game = getGame();
});
