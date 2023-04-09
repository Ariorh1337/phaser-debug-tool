import { gameObjList } from "../utils/globals";

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
            if (!obj.parentContainer?._pane) return;
            if (!(this as any)._pane) return;

            (this as any)._pane.movePaneTo(obj.parentContainer._paneChild);
        },
    };
    func.update = func.update.bind(func);

    obj.scene.events.on("update", func.update);
    obj.once && obj.once("destroy", () => {
        obj.scene.events.off("update", func.update);
        gameObjList.remove(obj.DebugID);
        setTimeout(() => folder.dispose(), 1)
    });
}
