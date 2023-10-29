import { hasProp } from "../utils/extra";

export default function defineTimeScale(folder: any, obj: any) {
    if (!hasProp(obj, "timeScale")) return;

    folder.addInput(obj, "timeScale", { min: 0, max: 10000, step: 0.01 });
}