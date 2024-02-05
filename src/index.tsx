import DebugWidget from './DebugWidget/index';

waitForDomReady().then(() => {
    const widget = new DebugWidget();
    const debug = widget.addFloatingWindow("Debug", 1, -1);    
});

/**
 * Waits for the DOM to be ready.
 *
 * @returns {Promise<void>} A promise that resolves when the DOM is ready.
 */
function waitForDomReady() {
    return new Promise<void>(resolve => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve();
            });
        }
    });
}
