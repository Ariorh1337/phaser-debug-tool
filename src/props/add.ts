import { addedToScene } from "../utils/extra";

/**
 * Overwrite the add method to add the child to the container
 * @param folder 
 * @param obj 
 */
export function defineAddAt(folder: any, obj: any) {
    const addMethod = obj.add;
    (obj as any).addAt = function (...args: any[]) {
        const elm = addMethod.apply(this, args as any);

        if (!Array.isArray(args[0])) {
            args[0] = [args[0]];
        }

        args[0].forEach((child: any) => addChild(folder, child));

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

        args[0].forEach((child: any) => addChild(folder, child));

        return elm;
    };
}

/**
 * Function to create button to add window.gameobj as child
 * @param folder 
 * @param obj 
 */
export function defineAddChildBtn(folder: any, obj: any) {
    folder.addButton({ title: "Add window.gameobj as child" }).on("click", () => {
        const element = (window as any).gameobj;
        if (element && element !== obj) obj.add(element);
    });
}

/**
 * Function to add a child to the folder
 * @param folder 
 * @param obj 
 * @returns 
 */
export function addChild(folder: any, obj: any) {
    if (obj._pane) {
        return obj._pane.movePaneTo(folder);
    }

    addedToScene(folder, obj);
}
