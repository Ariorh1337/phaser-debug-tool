export default function defineDebug(folder: any, obj: any, onUpdate: any) {
    if (!obj.scene) return;

    if (!obj.scene.__debugGraphics) {
        obj.scene.__debugGraphics = obj.scene.add.graphics();
        obj.scene.__debugGraphics.setDepth(9999999);

        const update = () => {
            obj.scene.__debugGraphics.clear();
        };

        obj.scene.__debugGraphics.scene.events.on("postupdate", update);
        obj.scene.__debugGraphics.once("destroy", () => {
            obj.scene.__debugGraphics.scene.events.off("postupdate", update);
        });
    }

    const proxy = {
        _debug: false,
        get debug() {
            return this._debug;
        },
        set debug(value) {
            this._debug = value;
        }
    };

    const update = () => {
        if (!proxy.debug) return;

        onUpdate(obj.scene.__debugGraphics);
    };

    obj.scene.events.on("postupdate", update);
    obj.once("destroy", () => {
        obj.scene.events.off("postupdate", update);
    });

    const input = folder.addInput(proxy, "debug", {});
    folder.on("refresh", () => input.refresh());
}
