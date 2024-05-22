const Methods = ['eventNames', 'listeners', 'listenerCount', 'emit', 'on', 'once', 'removeListener', 'removeAllListeners', 'off', 'addListener', 'shutdown', 'destroy'] as const;

const getIndexId = (function () {
    let id = 0;
    return function () {
        return id++;
    };
})();

const pool: any[] = [];

const proxy = {
    enabled: false,
};

let customEventEmitter: any;

// let eventsFolder: any;

export function addEvent(folder: any) {
    const input = folder.addInput(proxy, "enabled", {
        label: "Console All Events",
    });

    const eventsFolder = folder.addFolder({
        title: `Instance Events`,
        expanded: false,
    });

    customEventEmitter.__debug_eventsFolder = eventsFolder;

    if (pool.length) {
        pool.forEach((instance) => {
            instance.__debug_create();
        });

        pool.length = 0;
    }
}

function createClass(EventEmitter: any) {
    EventEmitter.__debug_shout = false;
    EventEmitter.__debug_id = -1;
    EventEmitter.__debug_folder = undefined;
    EventEmitter.__debug_ignoreEvents = [
        "pipelineafterflush", "pipelinebeforeflush",
        "render", "postrender", "prerender",
        "update", "postupdate", "preupdate",
        "step", "prestep", "poststep"
    ];

    EventEmitter.constructor._call = EventEmitter.constructor.call;
    EventEmitter.constructor.call = function (arg: any) {
        EventEmitter.constructor._call(arg);
        arg.__debug_id = getIndexId();
        arg.__debug_create();
    };

    Methods.forEach((key) => {
        const method = EventEmitter[key];

        // @ts-ignore
        EventEmitter[key] = function (...args: unknown[]) {
            if (proxy.enabled || this.__debug_shout) {
                if (EventEmitter.__debug_ignoreEvents) {
                    if (!EventEmitter.__debug_ignoreEvents.includes(args[0])) {
                        console.warn(`(${this.__debug_id}) Event.${key}("${args[0]}")`);
                    }
                }
            }

            if (key === "destroy") {
                this.__debug_destroy();
            }

            // @ts-ignore
            return method.call(this, ...args);
        };
    });

    EventEmitter.__debug_create = function () {
        if (!EventEmitter.__debug_eventsFolder) {
            return pool.push(this);
        }

        if (this instanceof Phaser.GameObjects.GameObject) {
            return;
        }

        if (this.__debug_folder !== undefined) {
            return;
        }

        const name = this.name || this.constructor.name || "Event";

        const folder = EventEmitter.__debug_eventsFolder.addFolder({
            title: `(${this.__debug_id}) ${name}`,
            expanded: false,
        });

        folder.addInput(this, "__debug_shout", {
            label: "Console Events",
        });

        folder.addMonitor(this, "_eventsCount", {
            label: "Events Count",
        });

        folder.addButton({ title: "Declare as: window.event" }).on("click", () => {
            (window as any).event = this;
        });

        this.__debug_folder = folder;
    }

    EventEmitter.__debug_destroy = function() {
        if (!EventEmitter.__debug_eventsFolder) {
            return;
        }

        EventEmitter.__debug_eventsFolder.removeFolder(this.__debug_folder);
    }

    customEventEmitter = EventEmitter;

    return EventEmitter;
}

// This all holly code is to overwrite the EventEmitter class from "eventemitter3" 😢
export default function overwriteEventEmitter() {
    function stopOverride() {
        // @ts-ignore
        if (Object.__phaser_debugger_ee_create) {
            // @ts-ignore
            Object.create = Object.__phaser_debugger_ee_create;
            // @ts-ignore
            delete Object.__phaser_debugger_ee_create;
        }
    }
    
    // @ts-ignore
    Object.__phaser_debugger_ee_create = Object.create;
    Object.create = function (...args: any) {
        if (args && Array.isArray(args) && args[0] && args[0].constructor) {
            if (args[0].constructor.name === "EventEmitter") {
                stopOverride();
    
                // @ts-ignore
                return Object.create(createClass(args[0]), ...args.slice(1));
            }
        }

        // @ts-ignore
        return Object.__phaser_debugger_ee_create(...args);
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(stopOverride, 1000);
    }, { once: true });
};