export default function defineInput(folder: any, obj: any) {
    const proxy = {
        get input() {
            return Boolean(obj?.input && obj?.input?.enabled);
        },

        set input(value) {
            if (obj.input) {
                obj.input.enabled = value;
            } else {
                console.log("no input to enable");
            }
        },
    };

    const input = folder.addInput(proxy, "input");
    folder.on("refresh", () => input.refresh());
}
