import { hasProp } from "../utils/extra";

export default function defineTint(folder: any, obj: any) {
    if (!hasProp(obj, "tintTopLeft")) return;
    if (!hasProp(obj, "tintTopRight")) return;
    if (!hasProp(obj, "tintBottomLeft")) return;
    if (!hasProp(obj, "tintBottomRight")) return;

    (obj as Phaser.GameObjects.Image).setTint()

    const proxy = {
        get TopLeft() {
            return obj.tintTopLeft;
        },
        get TopRight() {
            return obj.tintTopRight;
        },
        get BottomLeft() {
            return obj.tintBottomLeft;
        },
        get BottomRight() {
            return obj.tintBottomRight;
        },
        set TopLeft(value: any) {
            const { tintTopRight, tintBottomLeft, tintBottomRight } = obj;
            obj.setTint(value, tintTopRight, tintBottomLeft, tintBottomRight);
        },
        set TopRight(value: any) {
            const { tintTopLeft, tintBottomLeft, tintBottomRight } = obj;
            obj.setTint(tintTopLeft, value, tintBottomLeft, tintBottomRight);
        },
        set BottomLeft(value: any) {
            const { tintTopLeft, tintTopRight, tintBottomRight } = obj;
            obj.setTint(tintTopLeft, tintTopRight, value, tintBottomRight);
        },
        set BottomRight(value: any) {
            const { tintTopLeft, tintTopRight, tintBottomLeft } = obj;
            obj.setTint(tintTopLeft, tintTopRight, tintBottomLeft, value);
        },
    };

    const tintFolder = folder.addFolder({
        title: "Tint",
        expanded: false,
    });

    const input1 = tintFolder.addInput(proxy, "TopLeft", { view: "color" });
    folder.on("refresh", () => input1.refresh());

    const input2 = tintFolder.addInput(proxy, "TopRight", { view: "color" });
    folder.on("refresh", () => input2.refresh());

    const input3 = tintFolder.addInput(proxy, "BottomLeft", { view: "color" });
    folder.on("refresh", () => input3.refresh());

    const input4 = tintFolder.addInput(proxy, "BottomRight", { view: "color" });
    folder.on("refresh", () => input4.refresh());

    const clear = tintFolder.addButton({ title: "Clear" });
    clear.on("click", () => obj.clearTint());
}