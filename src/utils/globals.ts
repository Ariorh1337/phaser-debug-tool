export const gameObjList = {
    add: function (obj: any) {
        const UUID = (() => {
            // Phaser v3.11 has no Phaser.Utils.String.UUID
            if (Phaser.Utils.String.UUID) {
                return Phaser.Utils.String.UUID();
            } else if (Phaser.Math.RND.uuid) {
                return Phaser.Math.RND.uuid();
            } else {
                console.error("🪲 Phaser UUID is not found");
            }
        });

        const uuid = obj.DebugID || UUID();

        this.list[uuid] = obj;
        obj.DebugID = uuid;

        return uuid;
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
