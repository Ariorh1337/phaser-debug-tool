## About

If Phaser is found on the page, you will see `Phaser debug is enabled` message in console, at this point
the injection occurs. If you see this message after the Phaser has shown its version the injection is late.

To solve the problem where the project loads faster than the injection, you need to enable the overwrite
mode in the browser (if the project is third party) and before `new Phaser.Game(config)` being called you
need to execute `document.dispatchEvent(new Event("phaser-debug"));`

Extension button on the right side of the screen which will show a list of available scenes & FPS.

## Showcase

![scenes](./readme/chrome_1Rg0EENWSP.png)

![Spine](./readme/chrome_86qPcCaOnH.png)

![Rectangle](./readme/chrome_pusI5JVAiJ.png)

![Image](./readme/chrome_ST3AHGqiV8.png)

![Container](./readme/chrome_U0ADmIqujz.png)

![Text](./readme/chrome_XyvcK5kfX1.png)


## Build

Install the project: `npm install`

Chrome: `npm run build-chrome`
Firefox: `npm run build-firefox`

## Installation

### Chrome

1. Open Extension tab `chrome://extensions/`
2. Enable Developer Mode on top right corner
3. Press "Load Unpacked Extension"
4. Choose `dist` project folder
5. Refresh game tab
6. Left top corner you will see "Cheats" button

### Firefox

1. Open Debug tab `about:debugging#/runtime/this-firefox`
2. Click on "Load Temporary Add-on"
3. Choose manifest.json inside `dist` project folder
4. Refresh game tab
5. Left top corner you will see "Cheats" button

## TODO

1. Fix perfomance issue
2. Add search into scenes childer
3. Add arcade elements
