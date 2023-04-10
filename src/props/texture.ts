import { hasProp } from "../utils/extra";

export default function defineTexture(folder: any, obj: any) {
    if (!(hasProp(obj, "texture") && hasProp(obj, "frame"))) return;
    if (!(hasProp(obj.texture, "key") && hasProp(obj.frame, "name"))) return;

    const textureFolder = folder.addFolder({
        title: "Texture",
        expanded: true,
    });

    const list1Opt = () =>
        Object.keys(obj.texture.manager.list).map((a) => ({
            text: a,
            value: a,
        }));
    const list2Opt = () =>
        Object.keys(obj.texture.frames).map((a) => ({ text: a, value: a }));

    const saved = { list1: undefined, list2: undefined };

    const proxy = {
        get "texture.key"() {
            return obj.texture.key;
        },
        set "texture.key"(value) {
            obj.setTexture(value);
            (saved.list2 as any)?.dispose();
            saved.list2 = textureFolder.addInput(proxy, "frame.name", {
                options: list2Opt(),
                label: "frame",
            });
        },
        get "frame.name"() {
            return obj.frame.name;
        },
        set "frame.name"(value) {
            obj.setFrame(value);
        },
    };

    saved.list1 = textureFolder.addInput(proxy, "texture.key", {
        options: list1Opt(),
        label: "texture",
    });
    folder.on("refresh", () => (saved.list1 as any)?.refresh());
    saved.list2 = textureFolder.addInput(proxy, "frame.name", {
        options: list2Opt(),
        label: "frame",
    });
    //folder.on("refresh", () => (saved.list2 as any)?.refresh());
}
