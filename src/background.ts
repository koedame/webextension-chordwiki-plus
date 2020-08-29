const browser = require('webextension-polyfill');

// アイコンクリック時のアクション
browser.browserAction.onClicked.addListener((): void => {
  browser.tabs.create({
    url: 'https://ja.chordwiki.org/',
    active: true,
  });
});
