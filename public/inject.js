let url;

try {
    url = browser.extension.getURL('index.js');
} catch (err) {
    url = chrome.runtime.getURL('index.js');
}

const tab = (browser || chrome).tabs.getCurrent();
(browser || chrome).tabs.executeScript(tab.id, {
    "file": url,
    "all_frames": true,
    "run_at": "document_start"
});
