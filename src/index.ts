/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../node_modules/phaser/types/phaser.d.ts" />

import attachGame from "./attach/Game";

const api = window.__PHASER_DEBUG__;

if (api) {
    api.attach = attachGame;
} else {
    console.error("Phaser debug: ❌ Main module loaded without the interceptor (window.__PHASER_DEBUG__ is missing)");
}
