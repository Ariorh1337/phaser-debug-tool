/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);

    let html = document.childNodes[1];
    if (!html) html = document.childNodes[0];
    html.appendChild(script);
}

let url;

try {
    url = browser.extension.getURL('index.js');
} catch (err) {
    url = chrome.runtime.getURL('index.js');
}

injectScript(url);