//@ts-nocheck

import { hasProp } from "../utils/extra";

export default function defineText(folder: any, obj: any) {
    if (hasProp(obj, "text")) {
        const proxy = {
            get text() {
                return obj.text.toString().replaceAll("\n", "\\n");
            },
            set text(value: any) {
                obj.setText(value.split("\\n"));
            },
        };

        const input = folder.addInput(proxy, "text", {
            format: String,
        });
        folder.on("refresh", () => input.refresh());
    }
}
