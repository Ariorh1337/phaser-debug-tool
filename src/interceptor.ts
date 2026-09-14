const MAIN_SCRIPT_URL = document.documentElement.getAttribute('data-phaser-debug-url');

/**
 * It is a workaround to fire the DOMContentLoaded listener manually if the DOM is already loaded.
 * The issue persists only in Firefox. Issue https://github.com/Ariorh1337/phaser-debug-tool/issues/12
 */
(function() {
	'use strict';

	if (!MAIN_SCRIPT_URL?.startsWith('moz-extension://')) return;

	const originalAddEventListener = document.addEventListener;

	// @ts-ignore
	document.addEventListener = function(type, listener, options) {
		if (type !== 'DOMContentLoaded') {
			return originalAddEventListener.call(document, type, listener, options);
		}

		if (document.readyState === 'loading') {
			originalAddEventListener.call(document, type, listener, options);
		} else {
			console.log('Phaser debug: DCL is dead 😢. Firing DOMContentLoaded listener manually.');
			try {
				listener();
			} catch (e) {
				console.error('Phaser debug: Failed to run hijacked DCL listener 😭', e);
			}
		}
	};
})();

/**
 * Game detection.
 *
 * Phaser 3 (CommonJS entry `src/phaser.js`) assigns `global.Phaser`, so a setter on `window.Phaser`
 * used to be enough to notice the library and to replace `Phaser.Game` with a subclass.
 * Phaser 4 ships an ESM build (`dist/phaser.esm.js`, picked by Vite / webpack / esbuild) that never
 * touches `window.Phaser`, and the namespace object bundlers produce is frozen / getter-only,
 * so `Phaser.Game = ...` throws "Cannot set property Game ... which has only a getter".
 *
 * Instead of relying on the global we catch the `Phaser.Game` *instance* itself. Phaser 3 and 4
 * build `Game` with the ES5 `Class` helper and its constructor does plain assignments such as
 * `this.isBooted = false` and `this.hasFocus = false`. An inherited accessor on `Object.prototype`
 * receives those assignments with `this` bound to the freshly constructed game, no matter how
 * Phaser was loaded (UMD script tag, bundle, manual `window.Phaser = ...`).
 *
 * The accessor is non-enumerable, turns itself into a normal own data property on the first write
 * and only defers a cheap duck-type check, so regular page objects are not affected.
 */
(function () {
    'use strict';

    const LOG = 'Phaser debug:';

    /** Properties assigned inside the `Phaser.Game` constructor (3.0.0 … 4.x). */
    const TRAP_PROPS = ['hasFocus', 'isBooted'];

    const seen = new WeakSet<object>();
    let mainScriptLoaded: boolean | null = null;

    const api = {
        /** Set by the main script (index.js) once it is loaded. */
        attach: null as null | ((game: any) => void),

        /** Manual hook: `__PHASER_DEBUG__.register(game)` for games created before the extension ran. */
        register(game: any) {
            if (looksLikePhaserGame(game)) {
                onGameDetected(game);
            } else {
                console.warn(LOG, '⚠️ register(): the object does not look like a Phaser.Game instance', game);
            }
        },
    };

    Object.defineProperty(window, '__PHASER_DEBUG__', {
        value: api,
        configurable: true,
        enumerable: false,
        writable: false,
    });

    function looksLikePhaserGame(obj: any): boolean {
        return Boolean(obj)
            && typeof obj === 'object'
            && Boolean(obj.config) && typeof obj.config.postBoot === 'function'
            && Boolean(obj.events) && typeof obj.events.once === 'function'
            && Boolean(obj.scene) && Boolean(obj.loop)
            && typeof obj.boot === 'function'
            && typeof obj.step === 'function';
    }

    function loadMainScript(): boolean {
        if (mainScriptLoaded !== null) return mainScriptLoaded;

        mainScriptLoaded = false;

        if (!MAIN_SCRIPT_URL) {
            console.error(LOG, '❌ Failed to get runtime URL');
            return false;
        }

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', MAIN_SCRIPT_URL, false);
            xhr.send(null);

            if (xhr.status === 200) {
                new Function(xhr.responseText)();
                mainScriptLoaded = true;
                console.log(LOG, '✅ Main script loaded synchronously');
            } else {
                console.error(LOG, '❌ Failed to load, status:', xhr.status);
            }
        } catch (error) {
            console.error(LOG, '❌ Error loading main script:', error);
        }

        document.documentElement.removeAttribute('data-phaser-debug-url');

        return mainScriptLoaded;
    }

    function onGameDetected(game: any) {
        if (seen.has(game)) return;
        seen.add(game);

        console.log(LOG, '🪲 enabled');

        if (!loadMainScript() || !api.attach) {
            console.error(LOG, '❌ Main script is not available, cannot attach the debugger');
            return;
        }

        try {
            api.attach(game);
        } catch (error) {
            console.error(LOG, '❌ Failed to attach the debugger:', error);
        }
    }

    const defer: (fn: () => void) => void = typeof queueMicrotask === 'function'
        ? queueMicrotask
        : (fn) => { Promise.resolve().then(fn); };

    function check(obj: any) {
        if (looksLikePhaserGame(obj)) onGameDetected(obj);
    }

    TRAP_PROPS.forEach((prop) => {
        try {
            Object.defineProperty(Object.prototype, prop, {
                configurable: true,
                enumerable: false,
                get() {
                    return undefined;
                },
                set(this: any, value: unknown) {
                    if (this === null || (typeof this !== 'object' && typeof this !== 'function')) return;

                    try {
                        // Replace the inherited accessor with a plain own property,
                        // exactly what a normal assignment would have created.
                        Object.defineProperty(this, prop, {
                            value,
                            writable: true,
                            configurable: true,
                            enumerable: true,
                        });
                    } catch (e) {
                        // Non-extensible receiver: a native assignment would have been ignored as well.
                        return;
                    }

                    // The constructor is still running, inspect the object once it has finished.
                    defer(() => check(this));
                },
            });
        } catch (error) {
            console.error(LOG, '❌ Failed to install the game detector for', prop, error);
        }
    });
})();

export { };
