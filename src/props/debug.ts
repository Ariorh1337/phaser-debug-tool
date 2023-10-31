type DebugFunction = (graphics: Phaser.GameObjects.Graphics, folder: any) => void;

export default function defineDebug(folder: any, obj: any, onStart?: DebugFunction, onUpdate?: DebugFunction) {
    if (!obj.scene) return;

    if (!obj.scene.__debugGraphics) {
        obj.scene.__debugGraphics = obj.scene.add.graphics();
        obj.scene.__debugGraphics.setDepth(9999999);

        const update = () => {
            obj.scene.__debugGraphics.clear();
            obj.scene.__debugGraphics.lineStyle(1, 0x00ff00);
        };

        obj.scene.__debugGraphics.scene.events.on("update", update);
        obj.scene.__debugGraphics.once("destroy", () => {
            obj.scene.__debugGraphics.scene.events.off("update", update);
        });
    }

    const proxy = {
        _debug: false,
        get debug() {
            return this._debug;
        },
        set debug(value) {
            this._debug = value;

            obj.setData("__debug", value);
            obj.emit("__debug", value);
        }
    };

    const update = () => {
        if (!proxy.debug) return;

        onUpdate && onUpdate(obj.scene.__debugGraphics, folder);

        const { x, y, width, height, xOrigin, yOrigin } = getBounds(obj);
        if (width === 0 || height === 0) return;

        obj.scene.__debugGraphics.strokeRect(x, y, width, height);

        obj.scene.__debugGraphics.fillStyle(0xffff00, 1);
        obj.scene.__debugGraphics.fillCircleShape(
            (new Phaser.Geom.Circle(xOrigin - 10, yOrigin, 3))
        );
        obj.scene.__debugGraphics.fillCircleShape(
            (new Phaser.Geom.Circle(xOrigin + 10, yOrigin, 3))
        );
        obj.scene.__debugGraphics.fillStyle(0x00ffff, 1);
        obj.scene.__debugGraphics.fillCircleShape(
            (new Phaser.Geom.Circle(xOrigin, yOrigin - 10, 3))
        );
        obj.scene.__debugGraphics.fillCircleShape(
            (new Phaser.Geom.Circle(xOrigin, yOrigin + 10, 3))
        );
    };

    obj.scene.events.on("postupdate", update);
    obj.once("destroy", () => {
        obj.scene.events.off("postupdate", update);
    });

    const input = folder.addInput(proxy, "debug", {});
    folder.on("refresh", () => input.refresh());

    //

    type Pointer = Phaser.Input.Pointer;

    const func1 = (p: Pointer) => onPointerDown(p, obj);
    obj.scene.input.on("pointerdown", func1);
    const func2 = (p: Pointer) => onPointerMove(p, obj);
    obj.scene.input.on("pointermove", func2);
    
    obj.once("destroy", () => {
        obj.scene.input.off("pointermove", func2);
    });

    //

    onStart && onStart(obj.scene.__debugGraphics, folder);
}

function getBounds(obj: any) {
    let width = 0;
    let height = 0;

    if (obj.getBounds) {
        let bounds = obj.getBounds();
        width = bounds.width;
        height = bounds.height;
    } else if (obj.width && obj.height) {
        width = obj.width;
        height = obj.height;
    }

    if (width === 0 || height === 0) return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xOrigin: 0,
        yOrigin: 0
    };

    const { tx, ty } = obj.getWorldTransformMatrix();
    let { originX, originY } = obj;

    if (obj.originX === undefined) originX = 0.5;
    if (obj.originY === undefined) originY = 0.5;

    const x = tx - width * originX;
    const y = ty - height * originY;

    const xOrigin = x + width * originX;
    const yOrigin = y + height * originY;

    return { x, y, width, height, xOrigin, yOrigin };
}

function onPointerDown(
    pointer: Phaser.Input.Pointer,
    obj: any
) {
    if (!obj.getData("__debug")) return;

    const { xOrigin, yOrigin } = getBounds(obj);

    const left = pointer.x >= xOrigin - 20 && pointer.x <= xOrigin - 10;
    const right = pointer.x >= xOrigin + 5 && pointer.x <= xOrigin + 15;

    const top = pointer.y >= yOrigin - 20 && pointer.y <= yOrigin - 10;
    const bottom = pointer.y >= yOrigin + 10 && pointer.y <= yOrigin + 20;

    const center = (
        (pointer.x >= xOrigin - 5 && pointer.x <= xOrigin + 5) &&
        (pointer.y >= yOrigin - 5 && pointer.y <= yOrigin + 5)
    )

    const x = left || right || center;
    const y = top || bottom || center;

    obj.setData("dragging", { x, y });
}

function onPointerMove(
    pointer: Phaser.Input.Pointer,
    obj: any
) {
    if (!pointer.isDown) return;
    if (!obj.getData("__debug")) return;

    const { xOrigin, yOrigin } = getBounds(obj);

    const dragging = obj.getData("dragging");

    if (!dragging) return;

    if (dragging.x) {
        obj.x += pointer.x - xOrigin;
    }

    if (dragging.y) {
        obj.y += pointer.y - yOrigin;
    }
}
