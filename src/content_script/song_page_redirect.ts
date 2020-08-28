const queryString = require('query-string');

// 形式を統一してURLを扱いやすくするためURLを書き換える
const query = {
  // @ts-ignore
  c: document.getElementsByName('c')[0].value,
  // @ts-ignore
  t: document.getElementsByName('t')[0].value,
  // @ts-ignore
  key: document.getElementsByName('key')[0].value,
  // @ts-ignore
  symbol: document.getElementsByName('symbol')[0].value,
};

const stringifiedQuery = queryString.stringify(query);

location.replace(`https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`);
