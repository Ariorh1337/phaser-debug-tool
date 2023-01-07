import addGameObject from "../elements/GameObject";

export default function defineDestroy(folder: any, obj: any) {
    folder.addButton({ title: "Destroy" }).on("click", () => {
        obj.destroy();
    });
}

export function onDestroy(obj: any, folder: any, options: any) {
    const func = {
        scene: obj.scene,
        parent: obj.parentContainer || null,
        delta: 0,
        update: function (delta: number, time: number) {
            this.delta += delta;
            if (this.delta > 500) {
                this.delta = 0;
                if (folder.expanded) {
                    folder.emitter_.emit("refresh", { event: "refresh" });
                }
            }

            if (this.parent === obj.parentContainer) return;

            (obj.scene || this.scene).events?.off("update", this.update);
            folder.dispose();
            obj._pane = undefined;

            setTimeout(() => {
                if (!obj?.parentContainer?._pane) return;

                this.parent = obj.parentContainer;

                const pane = obj?.parentContainer?._paneChild || folder;
                addGameObject(pane, obj, options);
            }, 50);
        },
    };
    func.update = func.update.bind(func);

    obj.scene.events.on("update", func.update);
    obj.once("destroy", () => {
        obj.scene.events.off("update", func.update);
        folder.dispose();
    });
}
