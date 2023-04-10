export default function defineDeclare(folder: any, obj: any) {
    folder
        .addButton({ title: "Declare as: window.gameobj" })
        .on("click", () => {
            (window as any).gameobj = obj;
        });
}
