(function () {
    'use strict';

    if ((window as any).Phaser) {
        console.log("Phaser debug: 😢 executed too late (ServiceWorker PreCache?)");
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
        let mainScriptUrl = document.documentElement.getAttribute('data-phaser-debug-url');

        if (!mainScriptUrl) {
            console.error("Phaser debug: ❌ Failed to get runtime URL");
            return;
        }

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', mainScriptUrl, false);
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

