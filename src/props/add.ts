import { addedToScene } from "../utils/extra";

/**
 * Overwrite the add method to add the child to the container
 * @param folder
 * @param obj
 */
export function defineAddAt(folder: any, obj: any) {
    const addMethod = obj.addAt;
    (obj as any).addAt = function (...args: any[]) {
        const elm = addMethod.apply(this, args as any);

        if (!Array.isArray(args[0])) {
            args[0] = [args[0]];
        }

        args[0].forEach((child: any) => addedToScene(folder, child));

        return elm;
    };
}

/**
 * Overwrite the add method to add the child to the container
 * @param folder
 * @param obj
 */
export function defineAdd(folder: any, obj: any) {
    const addMethod = obj.add;
    (obj as any).add = function (...args: any[]) {
        const elm = addMethod.apply(this, args as any);

        if (!Array.isArray(args[0])) {
            args[0] = [args[0]];
        }

        args[0].forEach((child: any) => addedToScene(folder, child));

        return elm;
    };
}
