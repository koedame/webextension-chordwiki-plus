const contentBrowser = require('webextension-polyfill');
const axios = require('axios');
import { parse } from 'node-html-parser';
const queryString = require('query-string');

// ファビコン追加
const faviconTag: string = `<link rel="shortcut icon" href="${contentBrowser.extension.getURL('/icons/favicon.ico')}">`;
document.head.insertAdjacentHTML('beforeend', faviconTag);

const aTags = document.getElementsByTagName('a');
for (const aTag of aTags) {
  aTag.addEventListener('click', async (event) => {
    // @ts-ignore
    if (event.target && event.target.href && event.target.href.match(/\/wiki\//)) {
      event.preventDefault();
      // @ts-ignore
      await axios.get(event.target.href).then((res: any) => {
        const parsedHTML = parse(res.data);
        const query = {
          // @ts-ignore
          c: 'view',
          // @ts-ignore
          t: parsedHTML.querySelector('[name=t]')._attrs.value,
          // @ts-ignore
          key: '0',
          // @ts-ignore
          symbol: '',
        };

        const stringifiedQuery = queryString.stringify(query);
        location.href = `/wiki.cgi?${stringifiedQuery}`;
      });
    } else {
    }
  });
}
