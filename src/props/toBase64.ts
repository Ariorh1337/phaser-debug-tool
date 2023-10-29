import { hasProp } from "../utils/extra";

export default function defineToBase64(folder: any, obj: any) {
    if (!hasProp(obj, "texture")) return;

    folder.addButton({ title: "Export Base64" }).on("click", () => {
        const { scene, type, texture, frame } = obj;

        let base64;

        if (type === "Text") {
            const canvas = texture.getSourceImage();
            base64 = canvas.toDataURL("image/png");
        } else {
            base64 = scene.textures.getBase64(texture.key, frame?.name);
        }

        console.log(base64);
    });
}