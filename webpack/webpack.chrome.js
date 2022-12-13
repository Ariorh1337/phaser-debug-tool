const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CopyPlugin = require('copy-webpack-plugin');

const package = require('../package.json');

function modify(buffer) {
    // copy-webpack-plugin passes a buffer
    const manifest = JSON.parse(buffer.toString());

    // make any modifications you like, such as
    manifest.version = package.version;

    // pretty print to JSON with two spaces
    manifest_JSON = JSON.stringify(manifest, null, 2);
    return manifest_JSON;
}

const chrome = {
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "chrome.json",
                to: "manifest.json",
                context: "manifest",
                transform(content, absoluteFrom) {
                    return modify(content);
                },
            }]
        }),
    ]
};

module.exports = merge(common, chrome);
