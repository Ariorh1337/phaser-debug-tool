let url;

try {
    url = browser.extension.getURL('index.js');
} catch (err) {
    url = chrome.runtime.getURL('index.js');
}

const tab = (window.browser || window.chrome).tabs.getCurrent();
(window.browser || window.chrome).tabs.executeScript(tab.id, {
    "file": url,
    "all_frames": true,
    "run_at": "document_start"
});
