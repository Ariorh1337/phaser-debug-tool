(function() {
    let indexUrl;
    try {
        indexUrl = browser.extension.getURL('index.js');
    } catch (err) {
        indexUrl = chrome.runtime.getURL('index.js');
    }

    let interceptorUrl;
    try {
        interceptorUrl = browser.extension.getURL('interceptor.js');
    } catch (err) {
        interceptorUrl = chrome.runtime.getURL('interceptor.js');
    }

    document.documentElement.setAttribute('data-phaser-debug-url', indexUrl);

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', interceptorUrl);
	script.setAttribute('id', 'Phaser-Debugger');

    const target = document.head || document.documentElement;
    target.appendChild(script);
})();