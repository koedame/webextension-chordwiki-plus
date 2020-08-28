const contentBrowser = require('webextension-polyfill');

// ファビコン追加
const faviconTag: string = `<link rel="shortcut icon" href="${contentBrowser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);
