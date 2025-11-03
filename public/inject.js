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

	try {
		window.eval('');
		const code = loadScript(interceptorUrl);
		window.eval(code);
		return;
	} catch(err) {}

	try {
		(new Function(``))();
		const code = loadScript(interceptorUrl);
		(new Function(code))();
		return;
	} catch(err) {}

    var script = document.createElement('script');
	script.fetchPriority = 'high';
	script.async = false;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', interceptorUrl);
	script.setAttribute('id', 'Phaser-Debugger');

    const target = document.head || document.documentElement;
    target.appendChild(script);
})();

function loadScript(url) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.send(null);

	if (xhr.status === 200) {
		return xhr.responseText;
	} else {
		return '';
	}
}