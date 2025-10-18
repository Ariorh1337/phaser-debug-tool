/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import overwriteGame from "./overwrite/Game";

if (window.Phaser) {
    Phaser.Game = overwriteGame();
} else {
    console.error("Phaser debug: ❌ Main module loaded without Phaser instance");
}
