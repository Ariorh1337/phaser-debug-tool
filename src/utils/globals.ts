export const gameObjList = {
    add: function(obj: any) {
        const uuid = obj.DebugID || Phaser.Utils.String.UUID();
    
        this.list[uuid] = obj;
        obj.DebugID = uuid;
        
        return uuid;
    },
    get: function(id: string) {
        return this.list[id];
    },
    remove: function(id: string) {
        delete this.list[id];
    },
    list: {} as { [key: string]: any },
};

(window as any).gameObjList = gameObjList;
