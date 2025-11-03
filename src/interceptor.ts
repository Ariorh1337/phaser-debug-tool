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

(function () {
    'use strict';

    if ((window as any).Phaser) {
        console.log("Phaser debug: possibly executed too late (ServiceWorker PreCache? OR Phaser lib inside DOM?) 🤔");
        loadDebugger();
        return;
    }

    let debuggerLoaded = false;

    Object.defineProperty(window, "Phaser", {
        configurable: true,
        enumerable: true,
        set(value: any) {
            if (value.VERSION && value.VERSION.match(/2\.([0-9]*)\.([0-9]*)/)) {
                console.log("Phaser debug: 👴 v2 unsupported");
                (window as any)._Phaser = value;
                return;
            }

            (window as any)._Phaser = value;

            if (!debuggerLoaded) {
                debuggerLoaded = true;
                console.log("Phaser debug: 🪲 enabled");
                loadDebugger();
            }
        },
        get() {
            return (window as any)._Phaser;
        }
    });

    function loadDebugger() {
        if (!MAIN_SCRIPT_URL) {
            console.error("Phaser debug: ❌ Failed to get runtime URL");
            return;
        }

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', MAIN_SCRIPT_URL, false);
            xhr.send(null);

            if (xhr.status === 200) {
                new Function(xhr.responseText)();
                console.log("Phaser debug: ✅ Main script loaded synchronously");
            } else {
                console.error("Phaser debug: ❌ Failed to load, status:", xhr.status);
            }
        } catch (error) {
            console.error("Phaser debug: ❌ Error loading main script:", error);
        }

        document.documentElement.removeAttribute('data-phaser-debug-url');
    }
})();

export { };

