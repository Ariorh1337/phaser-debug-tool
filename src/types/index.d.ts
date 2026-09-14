declare interface PhaserDebugApi {
    /** Assigned by index.js; receives every detected `Phaser.Game` instance. */
    attach: ((game: Phaser.Game) => void) | null;
    /** Manual hook for games created before the extension was injected. */
    register: (game: Phaser.Game) => void;
}

declare interface Window {
    game: Phaser.Game;
    scene: Phaser.Scene;
    __PHASER_DEBUG__?: PhaserDebugApi;
}
