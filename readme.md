## About

This is an extension for automatic GUI inspector injection.
https://github.com/SilverTree7622/Phaser3_GUI_Inspector

If Phaser is found on the page, you will see an extension button on the right side of the screen which will show a list of available scenes.

After selecting the scene, you will be taken to the original GUI menu of the inspector

## Build

Install the project: `npm install`

Chrome: `npm run build-chrome`
Firefox: `npm run build-firefox`

## Installation

### Chrome

1. Open Extension tab `chrome://extensions/`
2. Enable Developer Mode on top right corner
3. Press "Load Unpacked Extansion"
4. Choose `dist` project folder
5. Refresh game tab
6. Left top corner you will see "Cheats" button

### Firefox

1. Open Debug tab `about:debugging#/runtime/this-firefox`
2. Click on "Load Temporary Add-on"
3. Choose manifest.json inside `dist` project folder
4. Refresh game tab
5. Left top corner you will see "Cheats" button
