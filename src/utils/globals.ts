import { uuid } from "./phaser";

export const gameObjList = {
    add: function (obj: any) {
        const id = obj.DebugID || uuid();

        this.list[id] = obj;
        obj.DebugID = id;

        return id;
    },

    get: function (id: string) {
        return this.list[id];
    },

    remove: function (id: string) {
        delete this.list[id];
    },

    list: {} as { [key: string]: any },
};

(window as any).gameObjList = gameObjList;
