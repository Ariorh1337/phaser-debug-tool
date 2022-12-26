import defineAlpha from "../props/alpha";
import defineDestroy from "../props/destroy";
import defineName from "../props/name";
import defineOrigin from "../props/origin";
import definePosition from "../props/position";
import defineRotation from "../props/rotation";
import defineScroll from "../props/scroll";
import defineSize from "../props/size";

export default function addCamera(
    pane: any,
    obj: Phaser.Cameras.Scene2D.Camera,
    options = { title: "", expanded: false }
) {
    const folder = pane.addFolder(options);
    (obj as any)._pane = folder;

    defineName(folder, obj);
    defineAlpha(folder, obj);
    folder.addInput(obj, 'backgroundColor', { view: 'color' });
    definePosition(folder, obj);
    defineSize(folder, obj);
    defineScroll(folder, obj);
    defineOrigin(folder, obj);
    defineRotation(folder, obj);

    folder.addInput(obj, 'zoom', { min: 0.1, max: 10, step: 0.01 });
    folder.addInput(obj, 'followOffset');
    folder.addInput(obj, 'disableCull');
    folder.addInput(obj, 'inputEnabled');
    folder.addInput(obj, 'roundPixels');
    folder.addInput(obj, 'useBounds');
    folder.addInput(obj, 'visible');

    folder.addMonitor(obj, 'centerX');
    folder.addMonitor(obj, 'centerY');
    folder.addMonitor(obj.midPoint, 'x', { label: 'midPoint x' });
    folder.addMonitor(obj.midPoint, 'y', { label: 'midPoint y' });
    folder.addMonitor(obj.worldView, 'x', { label: 'world x' });
    folder.addMonitor(obj.worldView, 'y', { label: 'world y' });
    folder.addMonitor(obj.worldView, 'width', { label: 'world width' });
    folder.addMonitor(obj.worldView, 'height', { label: 'world height' });

    if ((obj as any).deadzone) {
        folder.addMonitor((obj as any).deadzone, 'x', { label: 'deadzone x' });
        folder.addMonitor((obj as any).deadzone, 'y', { label: 'deadzone y' });
        folder.addMonitor((obj as any).deadzone, 'width', { label: 'deadzone width' });
        folder.addMonitor((obj as any).deadzone, 'height', { label: 'deadzone height' });
    }
  
    folder.addButton({ title: 'Fade in' }).on('click', () => { (obj as any).fadeIn(); });
    folder.addButton({ title: 'Fade out' }).on('click', () => { (obj as any).fadeOut(); });
    folder.addButton({ title: 'Flash' }).on('click', () => { (obj as any).flash(); });
    folder.addButton({ title: 'Reset effects' }).on('click', () => { (obj as any).resetFX(); });
    folder.addButton({ title: 'Shake' }).on('click', () => { (obj as any).shake(); });

    defineDestroy(folder, obj);

    return folder;
}