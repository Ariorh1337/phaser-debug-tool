import { hasProp } from "../utils/extra";

export default function defineName(folder: any, obj: any) {
    folder.title = folder.title || parseName(obj);

    const rnd = [
        Phaser.Math.Between(20, 40),
        Phaser.Math.Between(20, 40),
        Phaser.Math.Between(20, 40)
    ];
    folder.element.style.backgroundColor = `rgb(${rnd[0]}, ${rnd[1]}, ${rnd[2]})`;

    if (hasProp(obj, "name")) {
        const proxy = {
            get name() {
                return obj.name;
            },
            set name(value) {
                obj.name = value;
                folder.title = parseName(obj);
            }
        };

        const input = folder.addInput(proxy, "name");
        folder.on("refresh", () => input.refresh());
    }
}

export function parseName(obj: any) {
    let [name, type] = ["", ""];

    if (hasProp(obj, "type")) {
        type = obj.type;
    } else {
        type = obj.constructor.name;
    }

    if (hasProp(obj, "name") && obj.name !== "") {
        name = obj.name;
    } else {
        name = obj.constructor.name;
    }

    if (name === type) {
        return `() ${name}`;
    } else {
        return `(${name}) ${type}`;
    }
}
